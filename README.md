# NoteApp!

## Description

This web application (SPA) allows users to manage their notes, create, edit or delete them if they wish, as well as archive or unarchive them.
It consists of a Spring Boot backend and React/NextJS frontend.

v2: Added the possibility to add tags to notes, as well as to filter notes by tags.

## Prerequisites

Make sure you have the following installed on your system:

-  Java Development Kit(JDK) - Required for running the Spring Boot backend. SDK 21 version recommended.

- Node.js - Required for running the React frontend. Version 18.17.0 or higher is necessary.

-  npm - Node.js package manager. Version 9.6.7 or higher is necessary

- Apache Maven - Required for building and running the Spring Boot backend. Version 3.9.5 or higher is necessary

- Docker - Required for running the MySQL database container. Version 24.0.5 or higher is necessary for Docker 

- Docker Compose - Required for managing Docker containers with multiple services. Version v2.11.2 or higher is necessary.



## Installation

1. Clone the repository to your local machine:

    ```git clone https://github.com/your-username/your-repository.git```

2. Navigate to the project directory:

    ```cd your-repository```

3. Run the "run_app.sh" script to start the application:


    ```./run_app.sh```


## Usage

- Once the application is running, you can access the frontend at -http://localhost:3000- in your web browser
- IMPORTANT NOTE: If you run the application and the functionalities do not work correctly, consider to REFRESH the browser window where the application is running (localhost:3000).

## Troubleshooting

If you encounter any issues during installation or usage, please refer to the following troubleshooting steps:

- Make sure you have all the prerequisites installed correctly with the required versions.

- Check for any error messages in the terminal/console output.

- Consult the application logs for more detailed information on any errors.

- If the issue persists, feel free to open an issue in the GitHub repository for assistance.



## License

This project is licensed under the MIT License - see the LICENSE file for details.
