<div align="center">

# 🚀 ZYNC-CHAT

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=00D4FF&center=true&vCenter=true&width=940&lines=Real-Time+Chat+Application;Built+with+React+%26+Socket.io;Modern+UI+with+Curved+Design;Emoji+%26+GIF+Support" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Socket.io-4.6-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/ZYTRONA/ZYNC-CHAT?style=social" alt="Stars" />
  <img src="https://img.shields.io/github/forks/ZYTRONA/ZYNC-CHAT?style=social" alt="Forks" />
  <img src="https://img.shields.io/github/license/ZYTRONA/ZYNC-CHAT?style=flat-square" alt="License" />
</p>

<p align="center">
  <strong>A sleek, modern real-time chat application with curved UI design, emoji/GIF support, and room management</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

</div>

## ✨ Features

<table>
<tr>
<td>

### 💬 Real-Time Messaging
- Instant message delivery with Socket.io
- Typing indicators
- User join/leave notifications
- Message history

</td>
<td>

### 🎨 Modern UI/UX
- Curved border design
- Smooth animations
- Dark mode interface
- Responsive layout

</td>
</tr>
<tr>
<td>

### 🏠 Room Management
- Create custom chat rooms
- Room descriptions
- Delete rooms (creator only)
- Multiple room support

</td>
<td>

### 😊 Rich Content
- 30+ built-in emojis
- GIF integration
- Character counter
- Media support ready

</td>
</tr>
<tr>
<td>

### 🔐 Authentication
- JWT-based auth
- Secure password hashing
- User registration
- Protected routes

</td>
<td>

### 📱 Responsive Design
- Mobile optimized
- Tablet friendly
- Desktop enhanced
- Touch device support

</td>
</tr>
</table>

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io Client](https://img.shields.io/badge/Socket.io_Client-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ZYTRONA/ZYNC-CHAT.git
cd ZYNC-CHAT

# Install dependencies
npm install

# Set up environment variables
# Create .env files in both Client and Server directories
# See .env.example files for required variables

# Start the application (development mode)
chmod +x start-dev.sh
./start-dev.sh
```

### Manual Setup

#### Server Setup
```bash
cd Server
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# NODE_ENV=development

npm start
```

#### Client Setup
```bash
cd Client
npm install

# Create .env file with:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_SOCKET_URL=http://localhost:5000

npm start
```

## 🎯 Usage

### For Users

1. **Register/Login**
   - Create an account with username and password
   - Login to access the chat application

2. **Join or Create Rooms**
   - Click "Create Room" to make a new chat room
   - Select existing rooms from the sidebar
   - Add descriptions to help others understand the room purpose

3. **Start Chatting**
   - Type messages in the input field
   - Click emoji button (😊) to add emojis
   - Click GIF button (🎬) to insert GIFs
   - Press Send or hit Enter to send messages

4. **Manage Rooms**
   - Delete rooms you created using the 🗑️ button
   - View active users in each room
   - See typing indicators in real-time

### For Developers

#### Project Structure
```
ZYNC-CHAT/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Context providers
│   │   ├── utils/         # Helper functions
│   │   └── index.css      # Global styles
│   └── public/
├── Server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── socket/            # Socket.io handlers
│   └── utils/             # Utility functions
└── start-dev.sh           # Development startup script
```

## 🌟 Key Features Explained

### Curved UI Design
All borders use custom border-radius values (16px-32px) for a modern, smooth appearance.

### Real-Time Communication
Socket.io enables instant message delivery, typing indicators, and presence updates.

### Emoji & GIF Support
- 30 pre-selected emojis in a popup picker
- GIF integration with popular GIF categories
- Easy insertion with single click

### Room Management
- Users can create unlimited rooms
- Only room creators can delete their rooms
- Room descriptions help organize conversations

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 1024px (lg)
- Touch-optimized controls
- Adaptive layouts for all screen sizes

## 🚀 Deployment

### Deploy to Heroku (Server)
```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Deploy to Vercel (Client)
```bash
# Install Vercel CLI
vercel --prod
```

### Environment Variables for Production
Make sure to set all environment variables in your hosting platform.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ZYTRONA**
- GitHub: [@ZYTRONA](https://github.com/ZYTRONA)

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Tailwind CSS for styling utilities
- React community for excellent tools
- MongoDB for flexible database
- All contributors and users

## 📸 Screenshots

<div align="center">

### Login Screen
*Coming soon*

### Chat Interface
*Coming soon*

### Room Management
*Coming soon*

</div>

## 🐛 Known Issues

- None at the moment! Report issues [here](https://github.com/ZYTRONA/ZYNC-CHAT/issues)

## 🗺️ Roadmap

- [ ] File sharing support
- [ ] Voice/Video calling
- [ ] User profiles with avatars
- [ ] Direct messaging
- [ ] Message reactions
- [ ] Dark/Light theme toggle
- [ ] Message search
- [ ] User status (online/away/busy)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

<p>Made with ❤️ by <a href="https://github.com/ZYTRONA">ZYTRONA</a></p>

<img src="https://img.shields.io/github/last-commit/ZYTRONA/ZYNC-CHAT?style=flat-square" alt="Last Commit" />

</div>
