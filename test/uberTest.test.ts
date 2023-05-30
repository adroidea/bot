const mongoose = require("mongoose");
const assert = require("assert");
import { EventModel } from "../src/models/eventModel";
import { GuildModel } from "../src/models/guildModel";

const newEvent = new EventModel({
  title: "Test Event",
  description: "This is a test event",
  date: new Date(),
  duration: "2 hours",
  imageURL: "https://example.com/image.jpg",
  maxParticipants: 10,
  participantsId: ["user1", "user2"]
});

describe("EventModel", function () {
  before(async function () {
    this.timeout(40000);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should save a new event to the database", async function () {
    this.timeout(45000);

    const savedEvent = await newEvent.save();
    assert.notEqual(savedEvent, null);
  });

  it("should update an existing event in the database", async function () {
    this.timeout(45000);

    const savedEvent = await newEvent.save();
    const eventId = savedEvent._id;

    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      { title: "Updated Test Event" },
      { new: true }
    );

    assert.notEqual(updatedEvent, null);
    assert.equal(updatedEvent?.title, "Updated Test Event");
  });

  it("should delete an existing event from the database", async function () {
    this.timeout(45000);

    const savedEvent = await newEvent.save();
    const eventId = savedEvent._id;

    const deletedEvent = await EventModel.findByIdAndDelete(eventId);
    assert.notEqual(deletedEvent, null);

    const findDeletedEvent = await EventModel.findById(eventId);
    assert.equal(findDeletedEvent, null);
  });
});

describe("GuildModel", function () {
  before(async function () {
    this.timeout(40000);
    await mongoose.connect("mongodb://root:example@mongo:27017/", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("should save a new guild to the database", async function () {
    this.timeout(45000);
    const newGuild = new GuildModel({
      id: "test-guild-id",
      modules: {
        notifications: {
          enabled: true,
          publicLogs: {
            enabled: true,
            publicLogChannel: "public-log-channel-id"
          }
        },
        temporaryVoice: {
          enabled: true,
          hostChannels: ["host-channel-id"]
        },
        eventManagement: {
          enabled: true
        }
      }
    });

    const savedGuild = await newGuild.save();
    assert.notEqual(savedGuild, null);
  });
});
