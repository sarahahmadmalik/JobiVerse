"use client";
import { useState, useRef, useEffect } from "react";
import { FiPaperclip, FiImage, FiSend, FiX, FiMenu, FiMoreVertical, FiCalendar, FiSearch } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";

// Input component matching your style
const Input = ({ label, className = "", icon, ...props }) => {
  return (
    <div className="flex flex-col w-full relative">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full px-[24px] py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
          focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
          hover:border-gray-400 transition-all duration-200 ease-in-out ${icon ? 'pl-10' : ''} ${className}`}
      />
    </div>
  );
};

// Dummy data generators
const generateUsers = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    lastMessage: `Last message ${i + 1}`,
    time: `${i % 12 + 1}:${i % 60 < 10 ? '0' : ''}${i % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
    unread: i % 3 === 0, // More frequent unread messages for demo
    unreadCount: i % 3 === 0 ? (i % 5) + 1 : 0 // Random unread count 1-5
  }));
};

const generateMessages = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const isCurrentUser = i % 3 !== 0;
    return {
      id: i + 1,
      isCurrentUser,
      text: isCurrentUser 
        ? `Hey there! Just checking in about our conversation.`
        : `Thanks for reaching out! I'll get back to you soon.`,
      time: `${i % 12 + 1}:${i % 60 < 10 ? '0' : ''}${i % 60} ${i % 2 === 0 ? 'AM' : 'PM'}`,
      isUnread: i % 4 === 0, // Some messages marked as unread
      ...(i % 5 === 0 && {
        attachment: {
          type: i % 2 === 0 ? "pdf" : "image",
          name: i % 2 === 0 ? `document_${i + 1}.pdf` : `screenshot_${i + 1}.png`
        }
      })
    };
  });
};

export default function Chats() {
  const [message, setMessage] = useState("");
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeUser, setActiveUser] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Generate dummy data
  const [users, setUsers] = useState(generateUsers(8));
  const [messages, setMessages] = useState(generateMessages(12));
  const activeUserData = users.find(u => u.id === activeUser);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "" && !selectedFile) return;
    
    // Add new message
    const newMessage = {
      id: messages.length + 1,
      isCurrentUser: true,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUnread: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile({
        name: e.target.files[0].name,
        type: e.target.files[0].type.includes("image") ? "image" : "document"
      });
      setAttachmentMenuOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (activeUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === activeUser ? { ...user, unread: false, unreadCount: 0 } : user
        )
      );
      
      setMessages(prevMessages => 
        prevMessages.map(msg => ({ ...msg, isUnread: false }))
      );
    }
  }, [activeUser]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth < 768 && !e.target.closest('.sidebar') && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" />
      )}

      {/* Sidebar */}
      <div className={`sidebar p-3 fixed md:relative z-30 min-h-screen md:min-h-auto w-64 md:w-80  bg-white border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col ">
          {/* Sidebar header */}
          <div className="flex justify-between items-start">
         
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<FiSearch size={18} />}
            />
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 relative ${
                    activeUser === user.id ? "bg-colors-primary/10" : ""
                  }`}
                  onClick={() => {
                    setActiveUser(user.id);
                    setSidebarOpen(false);
                  }}
                >
                  {/* Unread indicator bar */}
                  {user.unread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-r-md" />
                  )}
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-colors-primary/10 flex items-center justify-center overflow-hidden">
                      <span className="text-colors-primary font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    {user.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 rounded-full flex items-center justify-center text-white text-xs px-1">
                        {user.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-medium truncate ${
                        user.unread ? "text-gray-900 font-semibold" : "text-gray-700"
                      }`}>
                        {user.name}
                      </p>
                      <span className={`text-xs ${
                        user.unread ? "text-colors-primary" : "text-gray-500"
                      }`}>
                        {user.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${
                      user.unread ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}>
                      {user.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No users found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat header with unread indicator */}
        <div className={`bg-white border-b p-3 md:p-4 flex items-center justify-between relative ${
          users.find(u => u.id === activeUser)?.unread ? "border-l-4 border-l-colors-primary" : ""
        }`}>
          {/* Unread indicator for mobile */}
          {users.find(u => u.id === activeUser)?.unread && (
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-colors-primary rounded-r-md" />
          )}
          
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-2 md:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu size={20} />
            </button>
            {activeUserData && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-colors-primary/10 flex items-center justify-center overflow-hidden">
                  <span className="text-colors-primary font-medium">
                    {activeUserData.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${
                    activeUserData.unread ? "text-colors-primary" : "text-gray-800"
                  }`}>
                    {activeUserData.name}
                    {activeUserData.unread && (
                      <span className="ml-2 text-xs bg-colors-primary/10 text-colors-primary px-2 py-0.5 rounded-full">
                        New messages
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activeUserData.unread ? "Unread messages" : "Online"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-colors-primary hover:bg-colors-primary/10 rounded-full">
              <FiCalendar size={18} />
            </button>
            <button className="p-2 text-gray-500 hover:text-colors-primary hover:bg-colors-primary/10 rounded-full">
              <FiMoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {!msg.isCurrentUser && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-colors-primary/10 flex items-center justify-center">
                      <span className="text-colors-primary text-sm font-medium">
                        {activeUserData?.name.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="max-w-xs md:max-w-md lg:max-w-lg space-y-1">
                  <div
                    className={`rounded-lg px-4 py-2 text-sm relative ${
                      msg.isCurrentUser
                        ? "bg-colors-primary text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    } ${
                      msg.isUnread && !msg.isCurrentUser ? "ring-1 ring-colors-primary" : ""
                    }`}
                  >
                    {msg.isUnread && !msg.isCurrentUser && (
                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-colors-primary rounded-full" />
                    )}
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                  
                  {msg.attachment && (
                    <div
                      className={`rounded-lg px-3 py-2 flex items-center text-sm ${
                        msg.isCurrentUser
                          ? "bg-colors-primary/90 text-white"
                          : `bg-white text-gray-800 border ${
                              msg.isUnread ? "border-colors-primary" : "border-gray-200"
                            }`
                      }`}
                    >
                      {msg.attachment.type === "pdf" ? (
                        <IoDocumentOutline size={20} className="mr-2" />
                      ) : (
                        <FiImage size={20} className="mr-2" />
                      )}
                      <span className="truncate">{msg.attachment.name}</span>
                    </div>
                  )}
                  
                  <p className={`text-xs ${
                    msg.isCurrentUser ? "text-right" : "text-left"
                  } ${
                    msg.isUnread ? "text-colors-primary font-medium" : "text-gray-500"
                  }`}>
                    {msg.time}
                    {msg.isUnread && !msg.isCurrentUser && (
                      <span className="ml-1">• Unread</span>
                    )}
                  </p>
                </div>
                
                {msg.isCurrentUser && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">Y</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected file preview */}
        {selectedFile && (
          <div className="px-4 py-2 bg-white border-t flex items-center justify-between">
            <div className="flex items-center">
              {selectedFile.type === "image" ? (
                <FiImage size={18} className="text-gray-500 mr-2" />
              ) : (
                <IoDocumentOutline size={18} className="text-gray-500 mr-2" />
              )}
              <span className="text-sm truncate max-w-xs">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={18} />
            </button>
          </div>
        )}

        {/* Message input */}
        <div className="bg-white border-t p-3">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <div className="relative mr-2">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-colors-primary rounded-full hover:bg-colors-primary/10"
                onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
              >
                <FiPaperclip size={20} />
              </button>

              {/* Attachment menu */}
              {attachmentMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border p-2 w-48">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.accept = ".pdf,.doc,.docx";
                      fileInputRef.current.click();
                    }}
                    className="flex items-center p-2 w-full text-left hover:bg-gray-100 rounded text-sm"
                  >
                    <IoDocumentOutline size={18} className="mr-2 text-gray-500" />
                    Document
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.click();
                    }}
                    className="flex items-center p-2 w-full text-left hover:bg-gray-100 rounded text-sm"
                  >
                    <FiImage size={18} className="mr-2 text-gray-500" />
                    Image
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary text-sm"
              placeholder="Type your message..."
            />

            <button
              type="submit"
              className="ml-2 p-2 bg-colors-primary text-white rounded-full hover:bg-colors-primary/90 focus:outline-none focus:ring-2 focus:ring-colors-primary focus:ring-offset-2 disabled:opacity-50"
              disabled={!message.trim() && !selectedFile}
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}