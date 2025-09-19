const express = require('express');
const router = express.Router();
const TeamMember = require('../../models/TeamMember.js');
const Property = require('../../models/Property.js');
const { sendError, sendSuccess } = require('../../lib/utils.js');

// Get all active team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({ isActive: true })
      .sort('order')
      .lean();

    // Add property counts for each team member
    const membersWithStats = await Promise.all(
      teamMembers.map(async (member) => {
        if (member.user) {
          const propertyCount = await Property.countDocuments({
            agent: member.user,
            isActive: true
          });
          return { ...member, propertyCount };
        }
        return { ...member, propertyCount: 0 };
      })
    );

    sendSuccess(res, membersWithStats);
  } catch (error) {
    console.error('Get team members error:', error);
    sendError(res, 'Failed to fetch team members', 500);
  }
});

// Get single team member by ID
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findOne({
      _id: req.params.id,
      isActive: true
    })
    .populate('user', 'firstName lastName email')
    .lean();

    if (!teamMember) {
      return sendError(res, 'Team member not found', 404);
    }

    // Get recent properties by this agent
    let recentProperties = [];
    if (teamMember.user) {
      recentProperties = await Property.find({
        agent: teamMember.user._id,
        isActive: true
      })
      .select('title price propertyType address images status')
      .sort('-createdAt')
      .limit(6)
      .lean();
    }

    sendSuccess(res, {
      ...teamMember,
      recentProperties
    });
  } catch (error) {
    console.error('Get team member error:', error);
    sendError(res, 'Failed to fetch team member', 500);
  }
});

// Get properties by team member
router.get('/:id/properties', async (req, res) => {
  try {
    const teamMember = await TeamMember.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!teamMember || !teamMember.user) {
      return sendError(res, 'Team member not found', 404);
    }

    const { page = 1, limit = 12, status = 'for-sale' } = req.query;

    const filter = {
      agent: teamMember.user,
      isActive: true
    };

    if (status) filter.status = status;

    const total = await Property.countDocuments(filter);
    const skip = (page - 1) * limit;

    const properties = await Property.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const pagination = {
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    sendSuccess(res, {
      properties,
      pagination,
      agent: {
        _id: teamMember._id,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
        position: teamMember.position
      }
    });
  } catch (error) {
    console.error('Get agent properties error:', error);
    sendError(res, 'Failed to fetch agent properties', 500);
  }
});

module.exports = router;