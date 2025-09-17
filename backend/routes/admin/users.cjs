const express = require('express');
const router = express.Router();
const User = require('../../models/User.cjs');
const { uploadConfigs } = require('../../lib/storage.cjs');
const { paginate, isValidEmail } = require('../../lib/utils.cjs');

// GET users list
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      sort = '-createdAt'
    } = req.query;

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Get total count
    const total = await User.countDocuments(filter);
    const pagination = paginate(page, limit, total);

    // Get users
    const users = await User.find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage)
      .lean();

    res.render('admin/users/index', {
      title: 'Users - Temer Properties Admin',
      users,
      pagination,
      filters: { search, role, isActive, sort },
      user: req.user
    });
  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load users',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// GET new user form
router.get('/new', (req, res) => {
  res.render('admin/users/form', {
    title: 'Add New User - Temer Properties Admin',
    userToEdit: null,
    isEdit: false,
    user: req.user
  });
});

// GET edit user form
router.get('/:id/edit', async (req, res) => {
  try {
    const userToEdit = await User.findById(req.params.id).lean();

    if (!userToEdit) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'User not found',
        status: 404
      });
    }

    res.render('admin/users/form', {
      title: `Edit ${userToEdit.firstName} ${userToEdit.lastName} - Temer Properties Admin`,
      userToEdit,
      isEdit: true,
      user: req.user
    });
  } catch (error) {
    console.error('Edit user form error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load user for editing',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// POST create user
router.post('/', uploadConfigs.avatars.single('avatar'), async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      isActive
    } = req.body;

    // Validation
    if (!username || username.length < 3) {
      return res.redirect('/admin/users/new?error=Username must be at least 3 characters');
    }

    if (!email || !isValidEmail(email)) {
      return res.redirect('/admin/users/new?error=Valid email address is required');
    }

    if (!password || password.length < 6) {
      return res.redirect('/admin/users/new?error=Password must be at least 6 characters');
    }

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.redirect('/admin/users/new?error=Username or email already exists');
    }

    const userData = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
      isActive: isActive === 'on'
    };

    // Add avatar if uploaded
    if (req.file) {
      userData.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = new User(userData);
    await user.save();

    res.redirect('/admin/users?success=User created successfully');
  } catch (error) {
    console.error('Create user error:', error);
    res.redirect('/admin/users/new?error=Failed to create user');
  }
});

// PUT update user
router.put('/:id', uploadConfigs.avatars.single('avatar'), async (req, res) => {
  try {
    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      isActive
    } = req.body;

    // Validation
    if (!username || username.length < 3) {
      return res.redirect(`/admin/users/${req.params.id}/edit?error=Username must be at least 3 characters`);
    }

    if (!email || !isValidEmail(email)) {
      return res.redirect(`/admin/users/${req.params.id}/edit?error=Valid email address is required`);
    }

    // Check for existing user with same username/email (excluding current user)
    const existingUser = await User.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.redirect(`/admin/users/${req.params.id}/edit?error=Username or email already exists`);
    }

    userToUpdate.username = username.toLowerCase();
    userToUpdate.email = email.toLowerCase();
    userToUpdate.firstName = firstName;
    userToUpdate.lastName = lastName;
    userToUpdate.role = role;
    userToUpdate.isActive = isActive === 'on';

    // Update password if provided
    if (password && password.length >= 6) {
      userToUpdate.password = password;
    }

    // Update avatar if uploaded
    if (req.file) {
      userToUpdate.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await userToUpdate.save();
    res.redirect('/admin/users?success=User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    res.redirect(`/admin/users/${req.params.id}/edit?error=Failed to update user`);
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting the current user
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Prevent deleting the last admin
    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET user details
router.get('/:id', async (req, res) => {
  try {
    const userToView = await User.findById(req.params.id).lean();

    if (!userToView) {
      return res.status(404).render('admin/error', {
        title: 'Error - Temer Properties Admin',
        message: 'User not found',
        status: 404
      });
    }

    res.render('admin/users/detail', {
      title: `${userToView.firstName} ${userToView.lastName} - Temer Properties Admin`,
      userToView,
      user: req.user
    });
  } catch (error) {
    console.error('User detail error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Temer Properties Admin',
      message: 'Failed to load user details',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

module.exports = router;