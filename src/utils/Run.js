import mongoose from 'mongoose';
import JobPost from '../models/jobpost.js';
import dotenv from 'dotenv';
dotenv.config();

const recruiterId = '6850a61475aa05580d733244'; // Replace with a valid Recruiter _id

const moreJobPosts = [
  {
    recruiterId,
    jobTitle: 'Embedded Systems Engineer',
    jobDescription: `Join our dynamic embedded systems team to design and develop firmware and low-level drivers for real-time applications in consumer electronics and IoT devices. You will work closely with cross-functional teams including hardware designers and software developers to bring innovative embedded solutions to life.

This role requires hands-on experience with microcontrollers (e.g., STM32, ESP32), real-time operating systems (RTOS), and communication protocols (SPI, I2C, UART). Your contribution will directly impact the performance and reliability of next-generation smart devices.`,
    responsibilities: [
      'Develop and debug firmware for ARM-based microcontrollers',
      'Integrate sensors and actuators into embedded platforms',
      'Ensure real-time responsiveness and low power consumption',
      'Collaborate with hardware and PCB engineers during prototyping and testing'
    ],
    requirements: [
      'Bachelor’s or Master’s degree in Electrical Engineering or related field',
      '3+ years of experience in embedded firmware development',
      'Proficiency in C/C++, RTOS, and debugging tools',
      'Familiarity with IoT standards and device security'
    ],
    skills: ['Embedded C', 'RTOS', 'Microcontrollers', 'I2C', 'SPI', 'UART'],
    experienceLevel: 'Intermediate',
    jobType: 'Full-time',
    salary: {
      value: 6200,
      currency: 'USD'
    },
    location: 'Munich, Germany',
    workMode: 'Onsite'
  },
  {
    recruiterId,
    jobTitle: 'Hardware Design Engineer',
    jobDescription: `As a Hardware Design Engineer, you will be responsible for the schematic design, PCB layout, and validation of analog and digital hardware systems for industrial control products. You will work in a fast-paced environment that emphasizes innovation and product reliability.

This role provides an exciting opportunity to lead the design of complex circuits involving microprocessors, power supplies, and high-speed interfaces. You’ll also perform hardware bring-up, compliance testing, and iterative board revisions.`,
    responsibilities: [
      'Create hardware schematics and multilayer PCB layouts',
      'Select components and validate hardware performance',
      'Conduct EMC/ESD testing and signal integrity analysis',
      'Support firmware team with hardware debugging tools'
    ],
    requirements: [
      'Degree in Electrical/Electronic Engineering',
      'Strong experience with Altium Designer or KiCAD',
      'Knowledge of analog signal processing and power electronics',
      'Hands-on experience with oscilloscopes, logic analyzers, etc.'
    ],
    skills: ['Altium', 'PCB Design', 'Signal Integrity', 'Power Electronics'],
    experienceLevel: 'Senior',
    jobType: 'Full-time',
    salary: {
      value: 7500,
      currency: 'USD'
    },
    location: 'Zurich, Switzerland',
    workMode: 'Hybrid'
  },
  {
    recruiterId,
    jobTitle: 'IoT Solutions Architect',
    jobDescription: `We’re looking for an experienced IoT Solutions Architect to design and deploy scalable IoT ecosystems for smart home and industrial applications. In this role, you will define device architecture, edge computing strategies, and cloud connectivity across our growing portfolio of connected products.

You’ll collaborate with firmware, hardware, and cloud teams to build secure and robust data pipelines. Your deep understanding of both embedded development and cloud protocols will help shape the future of our IoT solutions.`,
    responsibilities: [
      'Define architecture for IoT edge devices and gateways',
      'Select protocols and hardware for low-latency, reliable communication',
      'Evaluate cloud platforms (AWS IoT, Azure IoT) for scalability',
      'Enforce cybersecurity and firmware update policies'
    ],
    requirements: [
      'Experience with MQTT, CoAP, and cloud connectivity',
      'Strong understanding of embedded Linux and device provisioning',
      'Background in system security and remote monitoring',
      'Experience in multi-device fleet management'
    ],
    skills: ['IoT', 'MQTT', 'Edge Computing', 'Embedded Linux', 'Cloud IoT'],
    experienceLevel: 'Lead',
    jobType: 'Full-time',
    salary: {
      value: 9000,
      currency: 'USD'
    },
    location: 'Boston, MA, USA',
    workMode: 'Remote'
  },
  {
    recruiterId,
    jobTitle: 'FPGA Developer',
    jobDescription: `We are seeking a talented FPGA Developer to design and optimize digital logic for high-performance hardware systems. Your role will be to implement Verilog/VHDL-based designs for applications such as video processing, sensor fusion, and real-time data acquisition.

You will contribute to the full development lifecycle from simulation and synthesis to deployment and testing on FPGA platforms like Xilinx or Intel.`,
    responsibilities: [
      'Develop and simulate RTL designs in Verilog/VHDL',
      'Work with DSP and high-speed memory interfaces',
      'Integrate FPGA cores with microcontrollers and SoCs',
      'Perform timing analysis and optimization'
    ],
    requirements: [
      'Bachelor’s or Master’s in Electrical/Computer Engineering',
      'Hands-on with Vivado, Quartus, or similar toolchains',
      'Knowledge of digital signal processing techniques',
      'Strong debugging skills with ModelSim or similar'
    ],
    skills: ['FPGA', 'Verilog', 'VHDL', 'Vivado', 'Quartus', 'DSP'],
    experienceLevel: 'Senior',
    jobType: 'Contract',
    salary: {
      value: 8000,
      currency: 'USD'
    },
    location: 'Stuttgart, Germany',
    workMode: 'Onsite'
  },
  {
    recruiterId,
    jobTitle: 'Automotive Embedded Engineer',
    jobDescription: `This role focuses on embedded software development for modern automotive systems. You will work on ECUs, CAN communication, and real-time diagnostics to power the latest in vehicle automation and safety systems.

You will collaborate with OEMs and Tier 1 suppliers in meeting AUTOSAR and ISO26262 standards, ensuring compliance and functionality throughout the development cycle.`,
    responsibilities: [
      'Develop software for automotive ECUs using C/C++',
      'Integrate with CAN, LIN, and FlexRay protocols',
      'Conduct unit testing and verification per ISO26262',
      'Work in Agile teams with software and system engineers'
    ],
    requirements: [
      'Experience in automotive embedded systems',
      'Knowledge of AUTOSAR stack and diagnostics',
      'Strong grasp of real-time computing and safety standards',
      'Familiarity with tools like CANalyzer, Vector, or ETAS'
    ],
    skills: ['C/C++', 'CAN', 'AUTOSAR', 'ISO26262', 'Automotive ECU'],
    experienceLevel: 'Intermediate',
    jobType: 'Full-time',
    salary: {
      value: 7200,
      currency: 'USD'
    },
    location: 'Ingolstadt, Germany',
    workMode: 'Onsite'
  }
];


async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const inserted = await JobPost.insertMany(moreJobPosts);
    console.log(`✅ Inserted ${inserted.length} job posts.`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  } catch (err) {
    console.error('❌ Error inserting job posts:', err);
    process.exit(1);
  }
}

run();
