# How to Start the Project

Follow these steps to get the project up and running using Docker Compose:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/boarlabsxyz/razom.git 
    cd razom
    ```

2. **Set up environment variables:**
    Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

3. **Build and start the containers:**
    ```sh
    docker-compose up --build
    ```

4. **Open the project in your browser:**
    Navigate to `http://localhost:3000` to see the project in action.

5. **Run tests:**
    ```sh
    docker-compose run app npm test
    ```

For more detailed instructions, refer to the [documentation](./docs).

