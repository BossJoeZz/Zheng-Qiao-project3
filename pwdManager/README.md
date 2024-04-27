1. Open MongoDB and create a database named `passwdUrls`:

   ```bash
   cd pwdManager
   ```

2. Install dependencies: After navigating to the `pwdManager` directory, run the following command to install the project's dependencies:

   ```bash
   npm i
   ```

3. Start the server: Execute the following command to start the server:

   ```bash
   node server.cjs
   ```

4. Run in development mode: Run the following command to start the application in development mode:

   ```bash
   npm run dev
   ```

5. Operations:

    - Path `/`: This is likely the root path of your application, used to display the homepage or other relevant information.
    - Path `/login`: This path is used for user login. Users can provide their credentials to authenticate themselves.
    - Path `/register`: This path is used for user registration. Users can provide the necessary details to create a new account.
    - Path `/pwd`: This is the path for password management. Under this path, users can perform operations such as adding, deleting, modifying, and querying passwords.

6. Registration and login: To begin, users need to register a new account by accessing the `/register` path. They can provide the required information, such as a username and password, to create a new account. Once registered, users can log in using the provided credentials by accessing the `/login` path.

7. Password management page: Once users have successfully logged in, they can access the `/pwd` path to open the password management page. On this page, users can perform various operations such as adding new URLs, deleting URLs, modifying URL information, and querying URLs.

8. Adding URLs: On the password management page, users can choose to add a new URL. They can provide relevant URL information such as the website address, username, and password, and then click the submit button to add the URL to the database.

9. Sharing URLs: On the password management page, users can click the share button to send a request to other users. This may trigger an operation that allows users to enter the details of other users, such as their usernames or email addresses. Users can click the add button to add the shared URL to the corresponding user's account.

10. Copy button: On the password management page, users may see a copy button. This button allows users to copy the information of a specific URL, such as the username and password, so that they can paste it into other applications or websites.

11. completed:

     > ## Easy Copy to Clipboard - 1pt
     >
     > Next to each password there should be a button that allows users to copy the password to the clipboard (i.e., it should be the same as if the user selected the password and pressed CTRL+C or CMD+C to copy the password).
     >
     > ## Visually Obscured Passwords - 2pts
     >
     > When a user is looking at their own or shared passwords, there is a small risk that someone else would be able to look at their screen and manually copy the password. To make this a bit safer, obscure the passwords with some kind of filter. When the user presses the password or a nearby button, it should reveal the password:

