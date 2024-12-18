# Online Gardener Assistant - Web-based Application


## File Hierarchy
- JS and HTML files will be stored in ./src/, CSS will be stored in ./src/styles/

## Development Environment 
- VS Code.
- *Use `npm install` in the project root to install npm dependencies.
- *Use the commented code to get aquanited with the project. 


## Testing Environment
- *To initialize the firebase emlator, use `firebase emulator:start` to conduct backend testing.
- *Use Live Server to launch the front end to interact with the UI.
- **Additonal Tests 
- **Mocha and JSDom Automatic: user registration
 
## Core Features

### 1. User Profile and Garden Customization
- **User Account Creation**: Allow users to create an account to store personal preferences, garden size, plant types, and gardening goals.
- **Garden Information**: Users should input details about their garden (e.g., location, climate zone, soil type, garden layout, and plant types).
- **Customization**: Users can specify their level of gardening experience and what they need help with (e.g., flower garden, vegetable patch, indoor plants).

### 2. Weather Integration 
- **Real-time Weather Monitoring**: Provide up-to-date and localized weather forecasts for planning gardening tasks.
- **Weather-based Recommendations**: AI should offer insights based on upcoming weather conditions, like when to water, protect plants from frost, or delay planting.
- **Alerts and Notifications**: Send users notifications regarding sudden weather changes or optimal times for certain gardening tasks (like planting or harvesting).

### 3. Plant Database and Information 
- **Extensive Plant Database**: Users can search for plants and get detailed information, including sunlight needs, water requirements, soil preferences, common pests, and diseases.
- **Plant Care Tips**: Provide AI-generated care routines for each plant based on seasonal changes, weather, and the user’s local environment.
- **Plant Identification**: Allow users to upload photos of plants to identify or diagnose plant health issues with image recognition.

### 4. Gardening Routine Suggestions 
- **Routine Scheduling**: Create personalized gardening routines based on plant types, weather, and local growing conditions (e.g., when to plant, prune, fertilize, or harvest).
- **Task Reminders**: Set reminders for daily, weekly, or seasonal gardening tasks, such as watering, pest control, pruning, etc.
- **Seasonal Guidance**: Based on the user’s climate zone and available space, suggest the best plants to grow each season.

### 5. Interactive Garden Planner
- **Virtual Garden Layout**: Users can design their own garden layouts, specifying where each plant is located.
Plant Placement Suggestions: Provide AI-powered suggestions on where to place plants based on companion planting principles, sunlight availability, and spacing needs.
- **Growth Tracking**: Allow users to track the growth of their plants with images and notes.

### 6. Community and Social Features
Discussion Forums: Create a community space where users can share gardening tips, ask questions, and show off their progress.
- **User-Generated Content**: Users can share photos, plant care logs, and gardening journals.
- **AI-powered Q&A**: Use AI to assist users in answering gardening-related questions and drawing on the database and community knowledge.

### 7. Sustainability and Eco-Friendly Tips
- **Sustainable Gardening Practices**: Provide eco-friendly gardening tips, such as composting, conserving water, or growing pollinator-friendly plants.
Water Management Advice: Based on weather forecasts and plant types, offer guidance on reducing water usage.

### 8. AI Integration for Continuous Learning
- **Machine Learning for Plant Health**: Use AI to analyze photos of plants to detect diseases, pests, or nutrient deficiencies.
- **Learning from User Input**: Continuously improve plant care recommendations based on user data and feedback.

## User Interface Design
- **Mobile-Friendly**: The application should be responsive and work smoothly on desktop and mobile devices.
- **Intuitive Dashboard**: Provide users with a clean, easy-to-navigate dashboard highlighting their garden’s current status, upcoming tasks, and weather conditions.
- **Calendar View**: Offer a calendar view to track upcoming tasks and weather forecasts.
- **Visual Aids**: Use clear visuals (icons, images, and graphs) to represent garden health, plant growth, and weather forecasts.

## API Considerations
- **Weather API**: Real-time data for weather, humidity, and sunlight hours. (e.g., OpenWeatherMap, Weatherstack)
- **Plant Information API**: Access to a plant database for care instructions, growing conditions, and more. (e.g., Plant.id, Trefle)
- **Gardening Routine API**: AI-powered insights on planting schedules, pest control, and fertilizing. (Could be custom-built or third-party if available)
- **AI Image Recognition API**: Use AI to identify plants, pests, and diseases based on user-uploaded photos. (e.g., Google Vision API, PlantSnap)

## Optional Advanced Features
1. **AR Garden Visualization**: Allow users to visualize how their plants will look in their actual garden space using augmented reality (AR).
2. **Voice Assistant Integration**: Users can ask gardening questions or get reminders through smart speakers like Alexa or Google Home.
3. **Smart Irrigation Control**: Integrate with innovative garden systems that automate irrigation based on weather and plant needs.

# Online Gardener Assistant - Platforms, Development Environments, and Formatting

## Platforms

### 1. **Web Application Framework**

### 2. **Database**
- **Firebase**:
  - **Why**: A NoSQL database like Firebase allows for flexibility in handling unstructured data, ideal for user profiles, plant data, and dynamic datasets.
  - **Alternative**: **PostgreSQL** for a relational database with more complex querying capabilities.

### 3. **Hosting & Deployment Platforms**
- **AWS** (Amazon Web Services):
  - **Why**: AWS offers scalable solutions with services like Lambda (serverless functions), EC2 (VMs), and S3 (storage). It handles heavy API calls and provides global scalability.
  - **Alternative**: **Google Cloud Platform (GCP)** or **Microsoft Azure**, both with scalability options and AI support.

- **Netlify** or **Vercel** (for Frontend Deployment):
  - **Why**: Great for deploying static frontends built with React or Vue. Easy continuous integration and optimized for speed.

- **Docker** (for Containerization):
  - **Why**: Ensures consistent development, staging, and production environments. Valid for local development and cloud platform deployment.

---

## Development Environments

### 1. **IDE/Code Editor**
- **Visual Studio Code (VS Code)**:
  - **Why**: Widely used, customizable, and supports JavaScript, Node.js, React, and other tech. Extensions like **Prettier** (formatting) and **ESLint** (linting) boost productivity.
  
- **Alternative**: **JetBrains WebStorm** (excellent for full-stack but paid) or **Atom** (lightweight and open-source).

### 2. **Version Control**
- **Git**:
  - **Why**: Version control and collaborative development are essential. Use GitHub or GitLab for repository hosting.
  - **Recommended Practices**: Implement **GitFlow** or similar branching strategies for organized development.

### 3. **Development Frameworks/Environments**
- **Next.js** (for React):
  - **Why**: It provides server-side rendering (SSR), static site generation (SSG), and improved SEO. It also offers easy routing and API integration.
  
- **Express.js** (for Node.js backend):
  - **Why**: Express is lightweight and flexible, ideal for building RESTful APIs and efficiently handling multiple AI API calls.

### 4. **AI/ML Integration**
- **TensorFlow.js**:
  - **Why**: For client-side AI/ML processing. Useful for plant identification through image recognition running locally.
  - **Alternative**: Backend AI models with **Python-based TensorFlow** or **PyTorch**, exposed as APIs.

- **API Clients**: Use **Axios** or **Fetch API** in the front end for making API requests (weather, plant data, etc.) and **Node Fetch** or **Axios** in the backend for handling asynchronous API calls.

---

## Formatting and Best Practices

### 1. **Code Formatting**
- **Prettier**:
  - **Why**: Enforces consistent formatting in JavaScript/TypeScript code, enhancing readability and maintainability.
  - **Integrations**: Works well with VS Code and other IDEs.

- **ESLint**:
  - **Why**: A widely used linter for JavaScript/TypeScript, ensuring code follows best practices and avoids errors.
  - **Recommended Configurations**: Use **Airbnb JavaScript Style Guide** for consistent coding standards.

### 2. **API Design**
- **REST API**:
  - **Why**: Standard practice for handling external requests to services like weather and plant info APIs. It is easier to manage multiple endpoints and frontend-backend communication.
  - **Alternative**: **GraphQL** if efficient data querying or scaling to complex APIs is needed.

- **Swagger/OpenAPI** (for API documentation):
  - **Why**: Use Swagger to document your API. Ensures the development team and external users understand endpoints, parameters, and responses.

### 3. **State Management**
- **Redux** (for React):
  - **Why**: Redux efficiently manages the global state when tracking garden profiles, weather data, and tasks.
  - **Alternative**: **React Query** for managing server-side state, especially useful for frequent API calls.

### 4. **UI/UX Design and Prototyping**
- **Figma** or **Adobe XD**:
  - **Why**: Both are excellent tools for designing user interfaces and prototyping. Enables collaboration between designers and developers.
  
- **Tailwind CSS** (for styling):
  - **Why**: A utility-first CSS framework that works well with React. Offers flexibility and faster development compared to traditional CSS frameworks like Bootstrap.

---

## Testing and Continuous Integration (CI/CD)

### 1. **Unit Testing**
- **Jest**:
  - **Why**: Fast and works well with JavaScript frameworks like React. Allows comprehensive testing for both front end and back end.

### 2. **Integration Testing**
- **Cypress**:
  - **Why**: Excellent for end-to-end testing, ensuring that UI, backend, and APIs work together as expected.

### 3. **CI/CD Pipelines**
- **GitHub Actions** or **GitLab CI**:
  - **Why**: Automates application testing, building, and deployment. It can automatically trigger builds when code is pushed, ensuring smooth CI/CD workflow.

---

## Recommended Workflow

1. **Development**:
   - Use **VS Code** or **WebStorm** with **Prettier**, **ESLint**, and **Git**.
   - Write frontend in **React** (with **Next.js** for SSR/SSG if needed) and backend in **Node.js** with **Express**.
   
2. **Testing**:
   - Write unit tests using **Jest** and perform end-to-end tests with **Cypress**.
   
3. **Deployment**:
   - Deploy the frontend on **Netlify** or **Vercel**.
   - Deploy backend services on **AWS** or **GCP** with Docker for containerization.
   
4. **APIs and External Integration**:
   - Use **Axios** or **Fetch API** to call external AI APIs (weather, plant info, gardening routines).
   - Document your API using **Swagger**.

5. **Continuous Deployment**:
   - Automate using **GitHub Actions** or **GitLab CI**.

## How to Test AI Assistant

In the terminal, run the command 'node chatbot_draft.mjs' and then open http://localhost:3000
This will open your browser with the file chatbot_draft.html, you can then test the chatbot
