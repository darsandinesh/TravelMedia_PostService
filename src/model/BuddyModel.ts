import mongoose, { Schema, Document } from 'mongoose';

interface ITravelBuddy extends Document {
  userId: string;
  travelDate: Date;
  travelType: string;  
  location: string;
  description: string;
  interests: [
    {
      userId?: string; 
      interestedOn?: Date;  
    }
  ];
  participants: [
    {
      userId?: string;  
      joinedOn?: Date;  
    }
  ];
  maxParticipants: number;  
  created_at: Date;
  isPrivate: boolean; 
  isDeleted: boolean;
  travelDuration: number; 
  preferences: {
    budget: string; 
    accommodation: string; 
    transportMode: string; 
  };
  travelStatus?: string;  
  mediaUrls: string[];  
  report?: [
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
      },
      reason: {
        type: String,
      },
      reportDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const TravelBuddy = mongoose.model<ITravelBuddy>('TravelBuddy', TravelBuddySchema);
