import mongoose, { Schema, Document } from 'mongoose';

interface ITravelBuddy extends Document {
  userId: string;
  travelDate: Date;
  travelType: string;  // e.g., 'solo', 'family', 'friends', etc.
  location: string;
  description: string;
  interests: [
    {
      userId: string; // Users interested in this travel
      interestedOn: Date;  // Timestamp when the user showed interest
    }
  ];
  participants: [
    {
      userId: string;  // Users who have joined the travel
      joinedOn: Date;  // Timestamp when they joined
    }
  ];
  maxParticipants: number;  // Maximum number of participants allowed
  created_at: Date;
  isPrivate: boolean; // True if only invited users can join
  isDeleted: boolean;
  travelDuration: number; // Duration of the travel in days
  preferences: {
    budget: string; // e.g., 'low', 'medium', 'high'
    accommodation: string; // e.g., 'hotel', 'hostel', 'camping'
    transportMode: string; // e.g., 'car', 'flight', 'train', 'bus'
  };
  travelStatus: string;  // e.g., 'upcoming', 'ongoing', 'completed'
  mediaUrls: string[];  // URLs for images or videos uploaded
  report: [
    {
      userId: string;
      reason: string;
      reportDate: Date;
    }
  ];
}

const TravelBuddySchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  travelType: {
    type: String,
    required: true, // e.g., 'solo', 'family', 'friends', etc.
    enum: ['solo', 'family', 'friends', 'couple', 'group'],
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  interests: [
    {
      userId: {
        type: String,
        required: true,
      },
      interestedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  participants: [
    {
      userId: {
        type: String,
        required: true,
      },
      joinedOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  maxParticipants: {
    type: Number,
    required: true,
    default: 5, // Default maximum number of participants
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  isPrivate: {
    type: Boolean,
    default: false, // False by default, making the travel public
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  travelDuration: {
    type: Number, // Number of days for the travel
    required: true,
  },
  preferences: {
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'], // Budget options
      default: 'medium',
    },
    accommodation: {
      type: String,
      enum: ['hotel', 'hostel', 'camping', 'homestay'],
      default: 'hotel',
    },
    transportMode: {
      type: String,
      enum: ['car', 'flight', 'train', 'bus', 'bike'],
      default: 'car',
    },
  },
  travelStatus: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  mediaUrls: {
    type: [String],
  },
  report: [
    {
      userId: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
      reportDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model<ITravelBuddy>('TravelBuddy', TravelBuddySchema);
