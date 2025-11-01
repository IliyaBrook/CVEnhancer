import { ResumeData } from '@/types';

export const fakeResumeData: ResumeData = {
	personalInfo: {
		name: "Iliya Brook",
		title: "Full stack web developer",
		email: "iliyabrook1987@gmail.com",
		phone: "0549303336",
		location: "Tel-Aviv",
		linkedin: "linkedin.com/in/iliya-brook"
	},
	experience: [
		{
			company: "Progeeks LTD",
			location: "Tel Aviv, Hamerkaz",
			title: "Full Stack Developer",
			dateRange: "2021 - 2024",
			duties: [
				"Develop custom full-stack web applications for clients across e-commerce, healthcare, and education sectors using React, Node.js, and MongoDB",
				"Design and implement RESTful APIs with Express.js and PostgreSQL, improving data retrieval efficiency and enabling seamless frontend-backend communication",
				"Build responsive, mobile-first user interfaces using Tailwind CSS, Bootstrap and JavaScript, ensuring cross-browser compatibility",
				"Integrate third-party APIs including Stripe payment processing, SendGrid, and Google Maps, extending application functionality",
				"Collaborate with clients using Agile methodologies, delivering projects on schedule with clear communication and documentation",
				"Built and maintained enterprise-level web applications using React, Node.js, and MongoDB, managing complex business workflows and data operations",
				"Developed RESTful APIs with Express.js and PostgreSQL handling 500,000+ daily requests, implementing database indexing and query optimization strategies",
				"Implemented CI/CD pipelines using Docker, Kubernetes, and AWS, reducing deployment time from 2 hours to 15 minutes",
				"Optimized internal CRM system by refactoring database queries, reducing report generation time from 45 seconds to 8 seconds",
				"Created custom WhatsApp Business API integration using Node.js and Twilio, reducing manual messaging by 85%",
				"Developed time tracking application with React and Node.js, saving $3,600 annually in licensing costs",
				"Refactored legacy jQuery codebase to Redux architecture, reducing bug reports by 40% and page load times by 35%",
				"Collaborated with cross-functional teams following Scrum methodology, participating in daily standups and sprint planning",
				"Maintained application uptime above 99.5% through AWS CloudWatch monitoring and automated alerting"
			]
		},
		{
			company: "Bezeq LTD",
			location: "Tel Aviv, Hamerkaz",
			title: "Network Support Engineer",
			dateRange: "2017 - 2021",
			duties: [
				"Key Projects: WhatsApp Business Integration for Contract Signing & Customer Notifications",
				"Node.js | Express | WhatsApp Business API | Twilio | MongoDB | GCP Storage | Webhooks",
				"Designed custom WhatsApp Business API integration enabling automated contract delivery, digital signature collection, and real-time customer notifications for call center operations. Replaced expensive third-party service while improving customer response rates by 73%",
				"Built webhook-based notification system for order confirmations, appointment reminders, and contract status updates, reducing manual messaging workload by 85%",
				"Implemented secure document handling with GCP Storage, automated follow-ups for pending signatures, and flexible message templates with intelligent scheduling for mass communication campaigns",
				"Enterprise CRM System for Call Center & Sales Operations",
				"React | Redux | Node.js | Express | PostgreSQL | MongoDB | WebSockets | GCP | Docker | Kubernetes",
				"Architected comprehensive enterprise CRM platform managing call center operations, sales workflows, and administration across multiple departments. Implemented real-time dashboards with WebSockets for live call tracking and sales pipeline visualization, plus advanced analytics module with custom reporting that reduced report generation time by 82%",
				"Built role-based access control, automated task assignment, and customer communication tracking",
				"Optimized PostgreSQL queries with indexing and performance tuning, improving system response time from 3.2s to 0.4s",
				"Deployed on Google Cloud Platform using Kubernetes (GKE) and Docker containers, achieving 99.7% uptime"
			]
		},
		{
			company: "Upwork",
			location: "Remote",
			title: "Full Stack Developer (Freelance)",
			dateRange: "2024 - Present",
			duties: [
				"Develop custom full-stack web applications for clients across e-commerce, healthcare, and education sectors using React, Node.js, and MongoDB",
				"Design and implement RESTful APIs with Express.js and PostgreSQL, improving data retrieval efficiency and enabling seamless frontend-backend communication",
				"Build responsive, mobile-first user interfaces using Tailwind CSS, Bootstrap and JavaScript, ensuring cross-browser compatibility",
				"Integrate third-party APIs including Stripe payment processing, SendGrid, and Google Maps, extending application functionality",
				"Collaborate with clients using Agile methodologies, delivering projects on schedule with clear communication and documentation",
				"Built and maintained enterprise-level web applications using React, Node.js, and MongoDB, managing complex business workflows and data operations",
				"Developed RESTful APIs with Express.js and PostgreSQL handling 500,000+ daily requests, implementing database indexing and query optimization strategies",
				"Implemented CI/CD pipelines using Docker, Kubernetes, and AWS, reducing deployment time from 2 hours to 15 minutes",
				"Optimized internal CRM system by refactoring database queries, reducing report generation time from 45 seconds to 8 seconds",
				"Created custom WhatsApp Business API integration using Node.js and Twilio, reducing manual messaging by 85%",
				"Developed time tracking application with React and Node.js, saving $3,600 annually in licensing costs",
				"Refactored legacy jQuery codebase to Redux architecture, reducing bug reports by 40% and page load times by 35%",
				"Collaborated with cross-functional teams following Scrum methodology, participating in daily standups and sprint planning",
				"Maintained application uptime above 99.5% through AWS CloudWatch monitoring and automated alerting"
			]
		}
	],
	skills: [
		{
			title: "Programming Languages",
			categoryTitle: "Programming Languages",
			skills: ["JavaScript (ES6+), TypeScript, Python, Go, HTML5, CSS3/SCSS, SQL"]
		},
		{
			title: "Backend Technologies",
			categoryTitle: "Backend Technologies",
			skills: ["Node.js, Express.js, NestJS, GraphQL, RESTful APIs, LangGraph, WebSockets"]
		},
		{
			title: "Frontend Technologies",
			categoryTitle: "Frontend Technologies",
			skills: ["React, Redux, Svelte, Tailwind CSS, Bootstrap, Apollo GraphQL, Responsive Design"]
		},
		{
			title: "Databases",
			categoryTitle: "Databases",
			skills: ["MongoDB, PostgreSQL, MySQL"]
		},
		{
			title: "Development Practices",
			categoryTitle: "Development Practices",
			skills: ["Code Review, Version Control, API Design, Documentation, Performance Optimization"]
		},
		{
			title: "Cloud & DevOps",
			categoryTitle: "Cloud & DevOps",
			skills: ["AWS, GCP, Docker, Kubernetes (GKE), CI/CD, Git/GitHub"]
		},
		{
			title: "Operating Systems",
			categoryTitle: "Operating Systems",
			skills: ["Linux, Windows"]
		},
		{
			title: "Military Service",
			categoryTitle: "Military Service",
			skills: [
				"Completed 3 years of full military service in the Navy, reaching the rank of Staff Sergeant. Served as a medic and led an ambulance team.",
				"Optimized TCP/IP and L2/L3 protocols across network for 15% perf. & 20% reliability.",
				"Used Linux for system security, automating patching with Bash to cut vulnerabilities by 25%.",
				"Developed Python scripts for network monitoring, proactively resolving 95% of server issues.",
				"Implemented automated solutions using Bash, cutting routine network tasks by 40% for critical projects.",
				"Maintained 99.99% uptime with swift issue resolution; enhanced network security using Firewalls.",
				"Configured and maintained enterprise-grade VPN solutions, securing remote access and network integrity."
			]
		}
	],
	certifications: [
		"Hexlet Online Programming School - Full-Stack Development",
		"John Bryce College - Cyber Security",
		"ITC InterBit - Cisco Certified Network Associate (CCNA)"
	],
	projects: [],
	education: [
		{
			institution: "Hexlet Online Programming School",
			university: "",
			degree: "Certificate",
			field: "Full-Stack Development",
			location: "Tel Aviv, Hamerkaz",
			dateRange: "Education"
		},
		{
			institution: "John Bryce College",
			university: "",
			degree: "Certificate",
			field: "Cyber Security",
			location: "Tel Aviv, Hamerkaz",
			dateRange: "Education"
		},
		{
			institution: "ITC InterBit",
			university: "",
			degree: "Cisco Certified Network Associate (CCNA)",
			field: "",
			location: "Tel Aviv, Hamerkaz",
			dateRange: "Education"
		}
	]
};