# 🌟 **gitip** 🌟

<p align="center">✨ A handy CLI tool to manage GitHub issues & pull requests with ease ✨</p>

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/gitip.png?raw=true" title="gitip-logo" width="70%" />
</p>

## 🚀 **Getting Started**

### Installation

```sh
# Install globally
npm install gitip -g
gitip

# Or run directly with npx
npx gitip
```

### Usage

```sh
1. selection mode
gitip

2. command mode
gitip issue
gitip pr
gitip sync
gitip clean
```

## 📋 **Environment Setup**

### 1. Environment Configuration

By default, this tool operates in the **fork repo system** mode. ✨

If you prefer to use the **origin repo system** mode, simply include the `ORIGIN_REPO_OWNER` variable in your `.env` file. When `ORIGIN_REPO_OWNER` is detected, the tool will automatically switch to **origin repo system** mode, allowing you to interact directly with the original repository. 🚀

> - `fork repo system` = manage issues and pull requests in a **forked repository**
> - `origin repo system` = manage issues and pull requests directly in the **original repository**

---

## 🔧 Example Configurations

### 🔄 Environment Priority Loading

This tool determines which `.env` file to load based on the following priority order:

1. `.env.local`
2. `.env.test`
3. `.env.development`
4. `.env.production`
5. Any other `.env.*` file (e.g., `.env.staging`, `.env.custom`)
6. `.env`

If multiple `.env` files are present, the file with the highest priority will be loaded.

---

### 🔄 Fork Repo System Configuration

Use the following setup for working with a **forked repository**:

```env
GIT_ACCESS_TOKEN=your-github-access-token
FORK_REPO_OWNER=fork-repo-owner-name
UPSTREAM_REPO_OWNER=upstream-repo-owner-name
REPO_NAME=repository-name
DEFAULT_BRANCH_NAME=default-branch-name
TEMPLATE_TITLE_PLACEHOLDER=(optional) issue template title placeholder
```

---

### 🔗 Origin Repo System Configuration

Use the following setup for working directly with the **original repository**:

```env
GIT_ACCESS_TOKEN=your-github-access-token
ORIGIN_REPO_OWNER=origin-repo-owner-name
REPO_NAME=repository-name
DEFAULT_BRANCH_NAME=default-branch-name
TEMPLATE_TITLE_PLACEHOLDER=(optional) issue template title placeholder
```

---

## 📝 Notes

- ✅ If the `ORIGIN_REPO_OWNER` variable is present in the `.env` file, **gitip automatically switches to origin repo system mode**.
- 🚫 If `ORIGIN_REPO_OWNER` is missing, the tool defaults to **fork repo system mode**.
- 🔍 The tool checks for `.env` files in the current directory and loads them based on the priority described above.
- ⚠️ Ensure all required variables are included in the selected `.env` file to avoid runtime errors.

### 3. Issue Templates

This tool uses GitHub issue templates. If a template isn't available, the default template will be used. To use a specific template, set the `TEMPLATE_TITLE_PLACEHOLDER` variable in your `.env` file.

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-issuetemplate.png?raw=true" width="80%" title="issue-template" />
</p>

## ✨ **Features**

### 🖊️ 1. Create an Issue

- Easily create GitHub issues with just a few steps.

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/create-issue.gif?raw=true" width="70%" />
</p>

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/auto-issue.png?raw=true" width="70%" />
</p>

### 📑 2. Create a Pull Request

1. Commit your changes.
2. Select "Create a pull request."

- The pull request title and body are generated from your latest commit.
- Related issues are automatically closed when the pull request is merged (if the base branch is the default branch).

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/auto-pr.gif?raw=true" width="70%" />
</p>

> ⚠️ **Note**: To use the "close" keyword for related issues, the base branch must be the default branch.

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/gitip-default-branch.png?raw=true" width="70%" />
</p>

### 🔄 3. Synchronize Fork with Origin

Keep your fork updated with the origin branch effortlessly.

**😭 Manual Method (Not Recommended)**:
<br/> <p align="center"><img src="https://github.com/chltjdrhd777/image-hosting/blob/main/sync.png?raw=true" width="70%" /></p>

**☺️ Recommended Method (with gitip sync)**:
<br/> <p align="center"><img src="https://github.com/chltjdrhd777/image-hosting/blob/main/sync2.gif?raw=true" width="70%" /></p>

### 🗑️ 4. Clean Up Unused Issue Branches

Remove unused branches locally and remotely with ease.

#### 1. Local Debris:

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/issue-debris-from-local.png?raw=true" width="70%" />
</p>

#### 2. Fork Debris:

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/issue-debris-from-fork.png?raw=true" width="70%" />
</p>

#### 3. Cleaned State:

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/clean%20issue%20branches.gif?raw=true" width="70%" />
</p>

<p align="center">
  <img src="https://github.com/chltjdrhd777/image-hosting/blob/main/issue-clean2.png?raw=true" width="70%" />
</p>

## 📜 **CLI Commands**

### General Options:

- **`-o, --origin`**: Use origin repository (default is fork).
- **`-v, --version`**: Display the current version.
- **`-h, --help`**: Show help message.

### Commands:

#### **`issue` | `i`**

- Manage GitHub issues: Create, update, or retrieve issues.
- **Usage**: `gitip issue [-o]`

#### **`pr` | `p`**

- Manage GitHub pull requests: Create, update, or list pull requests.
- **Usage**: `gitip pr [-o]`

#### **`sync` | `s`**

- Synchronize your fork with the origin repository.
- **Usage**: `gitip sync [-o]`

#### **`clean` | `c`**

- Remove unused branches locally or remotely.
- **Usage**: `gitip clean [-o]`

## 💡 **Pro Tips**

- Use the `TEMPLATE_TITLE_PLACEHOLDER` environment variable to customize your issue titles.
- Keep your `.env` files updated for both fork and origin systems.

Enjoy managing your GitHub repositories with **gitip**! 😊
