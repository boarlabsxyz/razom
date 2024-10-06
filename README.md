# Razom - portal for helping veterans get reintegrated into society


## ApostropheCMS

This project uses [ApostropheCMS](https://apostrophecms.com/), a full-featured, open-source CMS built with Node.js.

For more information and useful resources, refer to the following links:

- [ApostropheCMS Documentation](https://docs.apostrophecms.org/)
- [ApostropheCMS GitHub Repository](https://github.com/apostrophecms/apostrophe)
- [ApostropheCMS Tutorials](https://apostrophecms.com/docs/tutorials/getting-started/)

## Get started

Follow these steps to get the project up and running using Docker Compose:
### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/).
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed on your local machine.
- [Node.js](https://nodejs.org/) installed on your local machine.

### Steps
1. **Clone the repository:**
    ```sh
    git clone https://github.com/boarlabsxyz/razom.git 
    cd razom
    ```

2. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

3. **Build and start the containers:**
    ```sh
    docker-compose up --build --watch
    ```

4. **Open the project in your browser:**
    Navigate to `http://localhost:3000` to see the project in action.

5. **Run tests:**
    ```sh
    docker-compose run app npm test
    ```

For more detailed instructions, refer to the [documentation](./docs).
