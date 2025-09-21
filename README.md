# 🪸 Coral Code Review Assistant

An AI-powered multi-agent code review system built with [Coral Protocol](https://www.coralprotocol.org/), demonstrating how specialized AI agents can collaborate to provide comprehensive code analysis.

## 🚀 What This Demonstrates

This application showcases **real multi-agent collaboration** using Coral Protocol's infrastructure to coordinate specialized AI agents for code review tasks:

- **Interface Agent** - Orchestrates the entire workflow and user interactions
- **GitHub MCP Agent** - Fetches repository data and analyzes project structure  
- **Repo Understanding Agent** - Performs deep codebase architecture analysis
- **Code Diffs Review Agent** - Examines code changes for potential issues
- **Unit Test Runner Agent** - Runs tests and analyzes code coverage

## 🎯 Problem Solved

**Code Review Bottlenecks**: Development teams often face delays in code reviews due to limited reviewer availability and varying expertise areas. This system provides:

- ✅ **Instant Analysis** - No waiting for human reviewers
- ✅ **Multi-Perspective Review** - Each agent specializes in different aspects
- ✅ **Comprehensive Coverage** - Security, quality, testing, and architecture
- ✅ **Consistent Standards** - Automated enforcement of coding standards
- ✅ **Reusable Infrastructure** - Built on Coral Protocol for extensibility

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   Web Interface     │◄──►│  Interface Agent    │
└─────────────────────┘    └─────────────────────┘
                                      │
                           ┌──────────┼──────────┐
                           │          │          │
                  ┌────────▼───┐ ┌────▼────┐ ┌──▼──────┐
                  │GitHub Agent│ │Code Rev │ │Test Run │
                  └────────────┘ └─────────┘ └─────────┘
                           │          │          │
                           └──────────┼──────────┘
                                      ▼
                           ┌─────────────────────┐
                           │  Coral Protocol     │
                           │  Coordination Layer │
                           └─────────────────────┘
```

## ✨ Key Features

- **Real-time Agent Coordination** - Watch agents work together in real-time
- **Multi-Agent Results** - Each agent contributes specialized insights
- **Interactive Dashboard** - Visual progress tracking and results
- **Comprehensive Reporting** - Security, quality, testing, and architecture analysis
- **GitHub Integration** - Supports both repositories and pull requests
- **Responsive Design** - Beautiful coral reef-inspired UI

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Multi-Agent System**: Coral Protocol
- **Agents**: GitHub MCP, Code Review, Test Runner, Repo Understanding
- **Styling**: Custom coral-themed design system

## 🎨 Design Philosophy

The interface draws inspiration from coral reef ecosystems - representing how different agents (like coral polyps) work together in harmony to create something beautiful and functional. The coral orange and ocean blue color palette reinforces this natural collaboration metaphor.

## 📊 Demo Flow

1. **Input**: Provide a GitHub repository or PR URL
2. **Orchestration**: Watch agents coordinate and work in parallel
3. **Analysis**: Each agent performs specialized analysis
4. **Results**: Comprehensive report with actionable insights
5. **Export**: Share and export findings

## 🔗 Links

- [Coral Protocol](https://www.coralprotocol.org/)
- [Agent Ecosystem](https://github.com/Coral-Protocol/awesome-agents-for-multi-agent-systems)
- [Build Guide](https://github.com/Coral-Protocol/build-agentic-software-w-coral-os-agents)

## 🎪 Hackathon Submission

This project was built for the **Coral Protocol App Builder Track** at Raise Your Hack 2025, showcasing:

- ✅ **Real working demo** solving code review bottlenecks
- ✅ **Clean, readable code** with modular React components  
- ✅ **Usable interface** with intuitive workflow and real-time feedback
- ✅ **Reusable value** - Other developers can extend with additional agents

### 🚀 Live Demo
- **Application URL**: [Deploy on Vercel](https://coral-code-review.vercel.app)
- **GitHub Repository**: [View Source Code](https://github.com/yourusername/coral-code-review)
- **Video Demo**: [5-minute presentation video]

### 📊 Submission Details
- **Project Title**: Coral Code Review Assistant - AI-Powered Multi-Agent Code Analysis System
- **Category**: AI/ML, Multi-Agent Systems, Code Review
- **Technology Stack**: React, TypeScript, Coral Protocol, GitHub API
- **Target Audience**: Development teams, DevOps engineers, open-source maintainers

**The Internet of Agents is here** - and this is just the beginning! 🌊

---

Built with ❤️ using Coral Protocol's decentralized AI agent infrastructure