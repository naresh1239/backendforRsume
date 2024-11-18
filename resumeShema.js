const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  currentlyWorking: { type: Boolean, required: true },
  workSummary: { type: String, required: true },
});

const EducationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  universityName: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  description: { type: String, required: true },
});

const SkillSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  backgroundColor : {type : String, },
  FontColor : {type : String, },
  themeColor: { type: String },
  summary: { type: String },
  experience: { type: [ExperienceSchema], default: [] },
  education: { type: [EducationSchema], default: [] },
  skills: { type: [SkillSchema], default: [] },
  RatingType : {type : Number,required : true},
  orderby : {type : [], default : []}
});

module.exports = mongoose.model('resumes', UserSchema);
