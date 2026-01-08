# How to Upload to a Friend's GitHub (Shared Device)

Since your computer is logged in as **You**, your friend needs to take specific steps to upload this project to **Their** GitHub without messaging up your settings.
how 
## Option 1: The "Fresh Start" (Recommended)
*Use this if your friend wants this to look like a brand new project created by them.*

1.  **Delete the existing Git history**:
    *   Delete the hidden `.git` folder in the project directory.
    *   *(In VS Code file explorer, if you don't see it, just run `rm -rf .git` or `rd /s /q .git` in terminal)*.

2.  **Initialize a new Git repository**:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    ```

3.  **Upload to Friend's GitHub**:
    *   Ask friend to create a **new empty repository** on their GitHub.
    *   Copy the HTTPS URL (e.g., `https://github.com/FRIEND_NAME/cool-project.git`).
    *   Run this command (Note: putting their username in the URL forces a login prompt):
    
    ```bash
    # Replace FRIEND_USERNAME and REPO_URL
    git remote add origin https://FRIEND_USERNAME@github.com/FRIEND_USERNAME/REPO_NAME.git
    
    git push -u origin main
    ```
    
    *   **When prompted**: failed login or a popup window will appear.
        *   If a browser window opens, **Log out of your GitHub** and let your friend log in.
        *   If it asks for a password in the terminal, your friend must use a **Personal Access Token (PAT)** (GitHub passwords don't work in terminal anymore).

---

## Option 2: Keep History (Just a Mirror)
*Use this if your friend just wants a copy of *your* work, keeping you as the author of previous commits.*

1.  **Remove your remote link**:
    ```bash
    git remote remove origin
    ```

2.  **Add Friend's remote**:
    ```bash
    git remote add origin https://FRIEND_USERNAME@github.com/FRIEND_USERNAME/REPO_NAME.git
    ```

3.  **Push**:
    ```bash
    git push -u origin main
    ```
    *(Follow authentication steps from Option 1)*

---

## 💡 Troubleshooting "Permission Denied"

If Git keeps saying `403 Permission Denied` (because it's automatically using your saved credentials), force it to ask for a password by including the username:

**Command:**
```bash
git push https://FRIEND_USERNAME@github.com/FRIEND_USERNAME/REPO_NAME.git main
```
