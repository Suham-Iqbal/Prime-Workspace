// User Data Management System
class UserStorage {
  static getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  static saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  static createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'regular', // 'admin' or 'regular'
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };
    
    // Check if email already exists
    if (users.find(user => user.email === newUser.email)) {
      throw new Error('An account with this email already exists.');
    }
    
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static authenticateUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.isActive);
    
    if (user && user.password === password) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      return user;
    }
    return null;
  }

  static isAdmin(userEmail) {
    const users = this.getUsers();
    const user = users.find(u => u.email === userEmail);
    return user && user.role === 'admin';
  }

  static updateUser(userId, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      return users[userIndex];
    }
    return null;
  }
}

// Activities Management System
class ActivityStorage {
  static getActivities() {
    return JSON.parse(localStorage.getItem('activities')) || [];
  }

  static saveActivities(activities) {
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  static createActivity(activityData) {
    const activities = this.getActivities();
    const newActivity = {
      id: Date.now().toString(),
      title: activityData.title,
      description: activityData.description,
      assignedDate: activityData.assignedDate,
      assignedTo: activityData.assignedTo, // user email or 'all'
      status: 'pending', // 'pending', 'in-progress', 'completed'
      createdBy: activityData.createdBy,
      createdAt: new Date().toISOString(),
      priority: activityData.priority || 'medium' // 'low', 'medium', 'high'
    };
    
    activities.push(newActivity);
    this.saveActivities(activities);
    return newActivity;
  }

  static getActivitiesForUser(userEmail) {
    const activities = this.getActivities();
    return activities.filter(activity => 
      activity.assignedTo === userEmail || activity.assignedTo === 'all'
    );
  }

  static updateActivityStatus(activityId, status) {
    const activities = this.getActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      activities[activityIndex].status = status;
      this.saveActivities(activities);
      return activities[activityIndex];
    }
    return null;
  }

  static deleteActivity(activityId) {
    const activities = this.getActivities();
    const filteredActivities = activities.filter(a => a.id !== activityId);
    this.saveActivities(filteredActivities);
    return true;
  }
}

// Chat Message Management with Admin Controls
class ChatStorage {
  static getMessages() {
    return JSON.parse(localStorage.getItem('chatMessages')) || [];
  }

  static saveMessages(messages) {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }

  static addMessage(messageData) {
    const messages = this.getMessages();
    const newMessage = {
      id: Date.now().toString(),
      username: messageData.username,
      email: messageData.email,
      text: messageData.text,
      timestamp: new Date().toISOString(),
      edited: false,
      editedAt: null
    };
    
    messages.push(newMessage);
    this.saveMessages(messages);
    return newMessage;
  }

  static editMessage(messageId, newText, userEmail) {
    const messages = this.getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1 && messages[messageIndex].email === userEmail) {
      messages[messageIndex].text = newText;
      messages[messageIndex].edited = true;
      messages[messageIndex].editedAt = new Date().toISOString();
      this.saveMessages(messages);
      return messages[messageIndex];
    }
    return null;
  }

  static deleteMessage(messageId, userEmail, isAdmin = false) {
    const messages = this.getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      // Allow deletion if user owns the message or is admin
      if (message.email === userEmail || isAdmin) {
        messages.splice(messageIndex, 1);
        this.saveMessages(messages);
        return true;
      }
    }
    return false;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserStorage, ActivityStorage, ChatStorage };
}