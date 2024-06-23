const db = require('../models');
const Users = db.users;

const Agents = db.agents;

const Applications = db.applications;

const Availability = db.availability;

const EventOrganizers = db.event_organizers;

const Events = db.events;

const Jobs = db.jobs;

const Musicians = db.musicians;

const Rsvps = db.rsvps;

const Venues = db.venues;

const AgentsData = [
  {
    // type code here for "relation_one" field

    business_info: 'Top talent agency for classical musicians.',

    contact_details: '444-555-6666, susan@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    Contact_Email: 'Erwin Schrodinger',

    Contact_Number: 'Charles Darwin',

    Business_Name: 'Euclid',

    Address: 'B. F. Skinner',
  },

  {
    // type code here for "relation_one" field

    business_info: 'Specializing in jazz and blues artists.',

    contact_details: '333-444-5555, tom@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    Contact_Email: 'Erwin Schrodinger',

    Contact_Number: 'Edward Teller',

    Business_Name: 'Stephen Hawking',

    Address: 'Pierre Simon de Laplace',
  },

  {
    // type code here for "relation_one" field

    business_info: 'Managing top rock and pop musicians.',

    contact_details: '123-456-7890, john@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    Contact_Email: 'Willard Libby',

    Contact_Number: 'Wilhelm Wundt',

    Business_Name: 'Claude Levi-Strauss',

    Address: 'B. F. Skinner',
  },

  {
    // type code here for "relation_one" field

    business_info: 'Representing versatile vocalists.',

    contact_details: '987-654-3210, jane@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    Contact_Email: 'Max Delbruck',

    Contact_Number: 'August Kekule',

    Business_Name: 'John Dalton',

    Address: 'Louis Pasteur',
  },
];

const ApplicationsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    status: 'submitted',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    status: 'reviewed',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    status: 'accepted',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    status: 'rejected',
  },
];

const AvailabilityData = [
  {
    // type code here for "relation_one" field

    available_from: new Date('2023-12-01T00:00:00Z'),

    available_to: new Date('2023-12-31T23:59:59Z'),
  },

  {
    // type code here for "relation_one" field

    available_from: new Date('2023-11-01T00:00:00Z'),

    available_to: new Date('2023-11-30T23:59:59Z'),
  },

  {
    // type code here for "relation_one" field

    available_from: new Date('2023-10-01T00:00:00Z'),

    available_to: new Date('2023-10-31T23:59:59Z'),
  },

  {
    // type code here for "relation_one" field

    available_from: new Date('2023-09-01T00:00:00Z'),

    available_to: new Date('2023-09-30T23:59:59Z'),
  },
];

const EventOrganizersData = [
  {
    // type code here for "relation_one" field

    name: 'Mike Jones Events',

    contact_details: '555-123-4567, mike@example.com',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    name: 'Susan Lee Productions',

    contact_details: '444-555-6666, susan@example.com',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    name: 'Tom Brown Entertainment',

    contact_details: '333-444-5555, tom@example.com',

    // type code here for "relation_many" field
  },

  {
    // type code here for "relation_one" field

    name: 'John Doe Events',

    contact_details: '123-456-7890, john@example.com',

    // type code here for "relation_many" field
  },
];

const EventsData = [
  {
    name: 'Rock Concert',

    description: 'A live rock concert featuring top bands.',

    start_date: new Date('2023-12-01T20:00:00Z'),

    end_date: new Date('2023-12-01T23:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_many" field
  },

  {
    name: 'Wedding Ceremony',

    description: 'A beautiful wedding ceremony with live music.',

    start_date: new Date('2023-11-15T15:00:00Z'),

    end_date: new Date('2023-11-15T18:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_many" field
  },

  {
    name: 'Jazz Night',

    description: 'An evening of smooth jazz performances.',

    start_date: new Date('2023-10-20T19:00:00Z'),

    end_date: new Date('2023-10-20T22:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_many" field
  },

  {
    name: 'Symphony Performance',

    description: 'A symphony performance featuring classical music.',

    start_date: new Date('2023-09-25T18:00:00Z'),

    end_date: new Date('2023-09-25T21:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_many" field
  },
];

const JobsData = [
  {
    title: 'Guitarist for Rock Band',

    description: 'Looking for an experienced guitarist for a rock band.',

    location: 'Cityville',

    date: new Date('2023-12-01T20:00:00Z'),

    payment: 200,

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    instrument: 'Francis Crick',

    Skills: 'Jean Baptiste Lamarck',
  },

  {
    title: 'Vocalist for Wedding',

    description: 'Seeking a versatile vocalist for a wedding ceremony.',

    location: 'Townsville',

    date: new Date('2023-11-15T15:00:00Z'),

    payment: 150,

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    instrument: 'Emil Fischer',

    Skills: 'Louis Victor de Broglie',
  },

  {
    title: 'Drummer for Jazz Band',

    description: 'Need a skilled drummer for a jazz band performance.',

    location: 'Metropolis',

    date: new Date('2023-10-20T19:00:00Z'),

    payment: 250,

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    instrument: 'Ludwig Boltzmann',

    Skills: 'Max Planck',
  },

  {
    title: 'Violinist for Symphony',

    description: 'Looking for a talented violinist for a symphony performance.',

    location: 'Cityburg',

    date: new Date('2023-09-25T18:00:00Z'),

    payment: 300,

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    instrument: 'Rudolf Virchow',

    Skills: 'B. F. Skinner',
  },
];

const MusiciansData = [
  {
    // type code here for "relation_one" field

    name: 'John Doe',

    // type code here for "images" field

    contact_details: '123-456-7890, john@example.com',

    resume: 'Experienced guitarist with 10 years in the industry.',

    education_training: 'B.A. in Music from Berklee College of Music',

    experience: 'Performed at various venues and events across the country.',

    instruments: 'Guitar, Piano',

    awards_credits: 'Best Guitarist 2020',

    // type code here for "files" field

    // type code here for "relation_many" field

    Skills: 'Archimedes',
  },

  {
    // type code here for "relation_one" field

    name: 'Jane Smith',

    // type code here for "images" field

    contact_details: '987-654-3210, jane@example.com',

    resume: 'Professional singer with a versatile voice.',

    education_training: 'Vocal training from Juilliard School',

    experience: 'Performed at weddings, corporate events, and concerts.',

    instruments: 'Vocals',

    awards_credits: 'Best Vocalist 2019',

    // type code here for "files" field

    // type code here for "relation_many" field

    Skills: 'Arthur Eddington',
  },

  {
    // type code here for "relation_one" field

    name: 'Mike Jones',

    // type code here for "images" field

    contact_details: '555-123-4567, mike@example.com',

    resume: 'Drummer with a passion for rock and jazz.',

    education_training: 'Drum lessons from renowned drummers.',

    experience: 'Played in multiple bands and studio sessions.',

    instruments: 'Drums',

    awards_credits: 'Best Drummer 2018',

    // type code here for "files" field

    // type code here for "relation_many" field

    Skills: 'Max von Laue',
  },

  {
    // type code here for "relation_one" field

    name: 'Susan Lee',

    // type code here for "images" field

    contact_details: '444-555-6666, susan@example.com',

    resume: 'Violinist with classical and contemporary experience.',

    education_training: 'M.A. in Music from Yale School of Music',

    experience: 'Performed with orchestras and solo performances.',

    instruments: 'Violin',

    awards_credits: 'Best Violinist 2017',

    // type code here for "files" field

    // type code here for "relation_many" field

    Skills: 'Galileo Galilei',
  },
];

const RsvpsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    response: 'not_attending',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    response: 'not_attending',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    response: 'maybe_attending',
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    response: 'maybe_attending',
  },
];

const VenuesData = [
  {
    // type code here for "relation_one" field

    name: 'The Grand Hall',

    location: '123 Main St, Cityville',

    capacity: 500,

    equipment: 'PA system, stage lighting, microphones',

    event_types: 'Concerts, Weddings, Corporate Events',

    // type code here for "images" field

    Venue_Type: 'John Bardeen',

    Address: 'John Bardeen',

    About: 'Johannes Kepler',
  },

  {
    // type code here for "relation_one" field

    name: 'The Jazz Club',

    location: '456 Elm St, Townsville',

    capacity: 200,

    equipment: 'Drum kit, piano, sound system',

    event_types: 'Jazz Nights, Private Parties',

    // type code here for "images" field

    Venue_Type: 'Linus Pauling',

    Address: 'Paul Dirac',

    About: 'Werner Heisenberg',
  },

  {
    // type code here for "relation_one" field

    name: 'The Rock Arena',

    location: '789 Oak St, Metropolis',

    capacity: 1000,

    equipment: 'Full backline, stage monitors, lighting rig',

    event_types: 'Rock Concerts, Festivals',

    // type code here for "images" field

    Venue_Type: 'Claude Bernard',

    Address: 'Michael Faraday',

    About: 'Max Born',
  },

  {
    // type code here for "relation_one" field

    name: 'The Acoustic Lounge',

    location: '321 Pine St, Villagetown',

    capacity: 150,

    equipment: 'Acoustic guitars, microphones, small PA system',

    event_types: 'Acoustic Sessions, Open Mic Nights',

    // type code here for "images" field

    Venue_Type: 'Ernst Haeckel',

    Address: 'Claude Levi-Strauss',

    About: 'Jean Baptiste Lamarck',
  },
];

// Similar logic for "relation_many"

async function associateAgentWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Agent0 = await Agents.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Agent0?.setUser) {
    await Agent0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Agent1 = await Agents.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Agent1?.setUser) {
    await Agent1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Agent2 = await Agents.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Agent2?.setUser) {
    await Agent2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Agent3 = await Agents.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Agent3?.setUser) {
    await Agent3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateApplicationWithJob() {
  const relatedJob0 = await Jobs.findOne({
    offset: Math.floor(Math.random() * (await Jobs.count())),
  });
  const Application0 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Application0?.setJob) {
    await Application0.setJob(relatedJob0);
  }

  const relatedJob1 = await Jobs.findOne({
    offset: Math.floor(Math.random() * (await Jobs.count())),
  });
  const Application1 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Application1?.setJob) {
    await Application1.setJob(relatedJob1);
  }

  const relatedJob2 = await Jobs.findOne({
    offset: Math.floor(Math.random() * (await Jobs.count())),
  });
  const Application2 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Application2?.setJob) {
    await Application2.setJob(relatedJob2);
  }

  const relatedJob3 = await Jobs.findOne({
    offset: Math.floor(Math.random() * (await Jobs.count())),
  });
  const Application3 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Application3?.setJob) {
    await Application3.setJob(relatedJob3);
  }
}

async function associateApplicationWithMusician() {
  const relatedMusician0 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Application0 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Application0?.setMusician) {
    await Application0.setMusician(relatedMusician0);
  }

  const relatedMusician1 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Application1 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Application1?.setMusician) {
    await Application1.setMusician(relatedMusician1);
  }

  const relatedMusician2 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Application2 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Application2?.setMusician) {
    await Application2.setMusician(relatedMusician2);
  }

  const relatedMusician3 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Application3 = await Applications.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Application3?.setMusician) {
    await Application3.setMusician(relatedMusician3);
  }
}

async function associateAvailabilityWithMusician() {
  const relatedMusician0 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Availability0 = await Availability.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Availability0?.setMusician) {
    await Availability0.setMusician(relatedMusician0);
  }

  const relatedMusician1 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Availability1 = await Availability.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Availability1?.setMusician) {
    await Availability1.setMusician(relatedMusician1);
  }

  const relatedMusician2 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Availability2 = await Availability.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Availability2?.setMusician) {
    await Availability2.setMusician(relatedMusician2);
  }

  const relatedMusician3 = await Musicians.findOne({
    offset: Math.floor(Math.random() * (await Musicians.count())),
  });
  const Availability3 = await Availability.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Availability3?.setMusician) {
    await Availability3.setMusician(relatedMusician3);
  }
}

async function associateEventOrganizerWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const EventOrganizer0 = await EventOrganizers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (EventOrganizer0?.setUser) {
    await EventOrganizer0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const EventOrganizer1 = await EventOrganizers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (EventOrganizer1?.setUser) {
    await EventOrganizer1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const EventOrganizer2 = await EventOrganizers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (EventOrganizer2?.setUser) {
    await EventOrganizer2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const EventOrganizer3 = await EventOrganizers.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (EventOrganizer3?.setUser) {
    await EventOrganizer3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

async function associateEventWithVenue() {
  const relatedVenue0 = await Venues.findOne({
    offset: Math.floor(Math.random() * (await Venues.count())),
  });
  const Event0 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Event0?.setVenue) {
    await Event0.setVenue(relatedVenue0);
  }

  const relatedVenue1 = await Venues.findOne({
    offset: Math.floor(Math.random() * (await Venues.count())),
  });
  const Event1 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Event1?.setVenue) {
    await Event1.setVenue(relatedVenue1);
  }

  const relatedVenue2 = await Venues.findOne({
    offset: Math.floor(Math.random() * (await Venues.count())),
  });
  const Event2 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Event2?.setVenue) {
    await Event2.setVenue(relatedVenue2);
  }

  const relatedVenue3 = await Venues.findOne({
    offset: Math.floor(Math.random() * (await Venues.count())),
  });
  const Event3 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Event3?.setVenue) {
    await Event3.setVenue(relatedVenue3);
  }
}

async function associateEventWithOrganizer() {
  const relatedOrganizer0 = await EventOrganizers.findOne({
    offset: Math.floor(Math.random() * (await EventOrganizers.count())),
  });
  const Event0 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Event0?.setOrganizer) {
    await Event0.setOrganizer(relatedOrganizer0);
  }

  const relatedOrganizer1 = await EventOrganizers.findOne({
    offset: Math.floor(Math.random() * (await EventOrganizers.count())),
  });
  const Event1 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Event1?.setOrganizer) {
    await Event1.setOrganizer(relatedOrganizer1);
  }

  const relatedOrganizer2 = await EventOrganizers.findOne({
    offset: Math.floor(Math.random() * (await EventOrganizers.count())),
  });
  const Event2 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Event2?.setOrganizer) {
    await Event2.setOrganizer(relatedOrganizer2);
  }

  const relatedOrganizer3 = await EventOrganizers.findOne({
    offset: Math.floor(Math.random() * (await EventOrganizers.count())),
  });
  const Event3 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Event3?.setOrganizer) {
    await Event3.setOrganizer(relatedOrganizer3);
  }
}

// Similar logic for "relation_many"

async function associateJobWithPosted_by() {
  const relatedPosted_by0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Job0 = await Jobs.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Job0?.setPosted_by) {
    await Job0.setPosted_by(relatedPosted_by0);
  }

  const relatedPosted_by1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Job1 = await Jobs.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Job1?.setPosted_by) {
    await Job1.setPosted_by(relatedPosted_by1);
  }

  const relatedPosted_by2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Job2 = await Jobs.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Job2?.setPosted_by) {
    await Job2.setPosted_by(relatedPosted_by2);
  }

  const relatedPosted_by3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Job3 = await Jobs.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Job3?.setPosted_by) {
    await Job3.setPosted_by(relatedPosted_by3);
  }
}

// Similar logic for "relation_many"

async function associateMusicianWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Musician0 = await Musicians.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Musician0?.setUser) {
    await Musician0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Musician1 = await Musicians.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Musician1?.setUser) {
    await Musician1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Musician2 = await Musicians.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Musician2?.setUser) {
    await Musician2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Musician3 = await Musicians.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Musician3?.setUser) {
    await Musician3.setUser(relatedUser3);
  }
}

// Similar logic for "relation_many"

async function associateRsvpWithEvent() {
  const relatedEvent0 = await Events.findOne({
    offset: Math.floor(Math.random() * (await Events.count())),
  });
  const Rsvp0 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Rsvp0?.setEvent) {
    await Rsvp0.setEvent(relatedEvent0);
  }

  const relatedEvent1 = await Events.findOne({
    offset: Math.floor(Math.random() * (await Events.count())),
  });
  const Rsvp1 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Rsvp1?.setEvent) {
    await Rsvp1.setEvent(relatedEvent1);
  }

  const relatedEvent2 = await Events.findOne({
    offset: Math.floor(Math.random() * (await Events.count())),
  });
  const Rsvp2 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Rsvp2?.setEvent) {
    await Rsvp2.setEvent(relatedEvent2);
  }

  const relatedEvent3 = await Events.findOne({
    offset: Math.floor(Math.random() * (await Events.count())),
  });
  const Rsvp3 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Rsvp3?.setEvent) {
    await Rsvp3.setEvent(relatedEvent3);
  }
}

async function associateRsvpWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Rsvp0 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Rsvp0?.setUser) {
    await Rsvp0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Rsvp1 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Rsvp1?.setUser) {
    await Rsvp1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Rsvp2 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Rsvp2?.setUser) {
    await Rsvp2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Rsvp3 = await Rsvps.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Rsvp3?.setUser) {
    await Rsvp3.setUser(relatedUser3);
  }
}

async function associateVenueWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Venue0 = await Venues.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Venue0?.setUser) {
    await Venue0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Venue1 = await Venues.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Venue1?.setUser) {
    await Venue1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Venue2 = await Venues.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Venue2?.setUser) {
    await Venue2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Venue3 = await Venues.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Venue3?.setUser) {
    await Venue3.setUser(relatedUser3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Agents.bulkCreate(AgentsData);

    await Applications.bulkCreate(ApplicationsData);

    await Availability.bulkCreate(AvailabilityData);

    await EventOrganizers.bulkCreate(EventOrganizersData);

    await Events.bulkCreate(EventsData);

    await Jobs.bulkCreate(JobsData);

    await Musicians.bulkCreate(MusiciansData);

    await Rsvps.bulkCreate(RsvpsData);

    await Venues.bulkCreate(VenuesData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateAgentWithUser(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateApplicationWithJob(),

      await associateApplicationWithMusician(),

      await associateAvailabilityWithMusician(),

      await associateEventOrganizerWithUser(),

      // Similar logic for "relation_many"

      await associateEventWithVenue(),

      await associateEventWithOrganizer(),

      // Similar logic for "relation_many"

      await associateJobWithPosted_by(),

      // Similar logic for "relation_many"

      await associateMusicianWithUser(),

      // Similar logic for "relation_many"

      await associateRsvpWithEvent(),

      await associateRsvpWithUser(),

      await associateVenueWithUser(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('agents', null, {});

    await queryInterface.bulkDelete('applications', null, {});

    await queryInterface.bulkDelete('availability', null, {});

    await queryInterface.bulkDelete('event_organizers', null, {});

    await queryInterface.bulkDelete('events', null, {});

    await queryInterface.bulkDelete('jobs', null, {});

    await queryInterface.bulkDelete('musicians', null, {});

    await queryInterface.bulkDelete('rsvps', null, {});

    await queryInterface.bulkDelete('venues', null, {});
  },
};
