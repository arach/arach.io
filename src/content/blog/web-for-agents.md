---
title: "AI-Driven Web Automation: Building the Action Layer"
pubDatetime: 2024-06-11T19:46:26.130Z
author: "Arach Tchoupani"
description: "AI currently lacks an effective action layer, limiting its potential in web automation. This article introduces an architecture to address this gap, offering innovative solutions to enhance AI-driven workflows and interactions with web applications. "
tags: ["AI", "AI Agents", "Browser Automation", "Web Automation", "Web Development"]
excerpt: ""
thumbnail: "assets/images/automation-thumbnail.png"
categories: []
featured: true
draft: false
---

## AI's need hands: An architecture for AI-Driven Digital Workflows

Imagine a world where AI agents navigate web applications as seamlessly as humans, using familiar tools instead of opaque, hidden systems. Despite advancements in web frameworks and browsers, current tools for programmatic access and web automation remain fragmented and inefficient. This article introduces a revolutionary architecture designed to bridge this gap, enabling AI to handle web interactions smoothly and intelligently. Join me as we explore the challenges, potentials, and innovative solutions that can transform web automation and unlock AI’s full potential.

<iframe src="https://giphy.com/embed/CmFMWpEa4IFtS" width="480" height="299" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/korea-north-automation-CmFMWpEa4IFtS">via GIPHY</a></p>

### AI and the Web: A Broken Paradigm

Accessing and automating web applications is still a fragmented experience. Whether it's consumer websites or B2B portals, developers face the dual challenge of limited APIs and outdated web scraping tools. This results in a less efficient process when dealing with dynamic content and complex interactions.

### The Need for Programmatic Access to the Web

Despite the myriad of web applications, current methods of accessing and automating them programmatically are inadequate. The agents layer addresses these limitations by mimicking human interactions to automate repetitive tasks like data extraction, form submissions, and real-time monitoring. With AI's potential to augment and automate human work, better tooling is essential. In a previous post, I argued that the future is not in more APIs, but in a better structure for exposing the information and logic of the web for programs—what I call 🤖-a11y.

### How 🤖-a11y Can Work

There are two main strategies for enabling 🤖 accessibility: retrofitting websites and implementing new frameworks. The choice depends on the tech stack and flexibility of the roadmap. Retrofitting works around the periphery without needing permission from core teams, while new frameworks require adoption but can be seamlessly integrated using tools like React, Next.js, Laravel, Rails, or Django.

#### Retrofitting Websites

Imagine deploying AI to index all app actions and expose them as a web API. This scalable mapping of software interfaces would expose information and actions for 🤖 to access.

**Architecture**:
- **Multimodal Models**: Use models like GPT-4o and GPT-4v to understand the context and structure of web pages using visual understanding.
- **Extraction Markup**: Use LLMs to extract context from HTML sections and build a detailed RAG context graph.
- **Code Generation**: Use LLMs' ability to generate code and apply it to frameworks like Playwright. Each page and each form is a separate deterministic program.

**Example Implementation**:
```typescript
import { Browser, Page } from 'playwright';

export class HubSpotAutomationHandler {
  private browser: Browser;
  private page: Page;

  constructor(browser: Browser, page: Page) {
    this.browser = browser;
    this.page = page;
  }

  async getNavigations(url: string): Promise<void> {
    await this.page.goto(url);
    const buttons = await this.page.$$('#hs-vertical-nav button');
    const navigations: Record<string, any> = {};

    for (const button of buttons) {
      await button.click();
      const secondary_menu = await this.page.$$("div[data-menu-item-level='secondary']");
      const nav_key = await this.page.innerText(button);
      navigations[nav_key] = {
        nav_key,
        text: nav_key,
        sub_navs: []
      };

      for (const sub_nav of secondary_menu) {
        const subnav_key = await this.page.innerText(sub_nav);
        if (subnav_key) {
          navigations[nav_key].sub_navs.push({
            nav_key: subnav_key,
            url: await this.page.getAttribute(sub_nav, 'href'),
            text: subnav_key
          });
        }
      }
    }
    // Store navigation data in the database
  }
}
```

### New 🤖-a11y Frameworks

Apple’s latest event showcased a sophisticated approach to declarative automation for the agent layer with the [AppIntents API](https://developer.apple.com/documentation/appintents). This framework offers app developers a declarative way to define *intents* that will be exposed to Siri and therefore Apple Intelligence. Instead of building tooling to reverse engineer the intents from app API or the code itself, giving app developers the ability to declare *precisely* what they want to expose to Siri creates a super clean and powerful developer experience. It's also much less headaches for Apple. 

### What does that look like for the Web?

Imagine if you could declare app intents in a framework like NextJS, Laravel, Rails, Django and/or anything that uses React? This would allow developers to expose web application logic and data to programs without having to build separate APIs for every single thing they build. They could seamlessly use the same code to drive their web applications and their AI-powered agents and be in control of exactly what they expose to which audience and how!

**Architecture**:
1. **Decorators and Action Handlers**: The Action decorator adds metadata to methods in the IntentHandlers class. The getActions function retrieves these actions.
2. **Context for Actions**: The ActionProvider context makes the actions and handlers available throughout the app.
3. **React Components**: The ActionExecutor component uses the context to display and execute available actions.
4. **Integration**: The HomePage integrates the ActionExecutor component within the ActionProvider context.

#### Implementation in TypeScript:

```typescript
import { Action, getActions } from '../utils/decorators';

class IntentHandlers {
  @Action('Create Project')
  async createProject(name: string, description: string): Promise<string> {
    return `Project "${name}" created successfully.`;
  }

  @Action('Assign Task')
  async assignTask(projectId: string, taskId: string, userId: string): Promise<string> {
    return `Task "${taskId}" assigned to user "${userId}" in project "${projectId}".`;
  }

  @Action('Complete Task')
  async completeTask(taskId: string): Promise<string> {
    return `Task "${taskId}" marked as complete.`;
  }

  @Action('Get Project Details')
  async getProjectDetails(projectId: string): Promise<string> {
    return `Details for project "${projectId}".`;
  }

  @Action('Delete Project')
  async deleteProject(projectId: string): Promise<string> {
    return `Project "${projectId}" deleted successfully.`;
  }
}

export const intentHandlers = new IntentHandlers();
export const availableActions = getActions(IntentHandlers);
```

### Conclusion

The proposed architecture for AI-driven web automation marks a significant leap forward, enhancing efficiency and flexibility in web interactions. When developers, workflow automation platforms, and AI 🤖 have access to the same information and workflows as human users, we will be able to truly unlock the full potential of AI. Imagine AI agents seamlessly handling customer service, automating data analysis, and optimizing workflows in real-time and in collaboration with human users. By adopting this hybrid human + AI, businesses and developers can drive unprecedented innovation and productivity.

If you’re building in this space or have ideas to share, I’d love to hear from you. 

<iframe src="https://giphy.com/embed/jsI8nBXJl6s7r7iuJ5" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/siliconvalleyhbo-jsI8nBXJl6s7r7iuJ5">via GIPHY</a></p>