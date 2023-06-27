import { GuildModel } from "../../src/models/guildModel";
import mongoose from "mongoose";
require("dotenv").config();

const mongoURI = process.env.MONGO_URI ?? "mongodb://root:example@mongo:27017/";

describe("GuildModel", () => {
  let savedGuildId: string;

  beforeAll(async () => {
    jest.setTimeout(40000);
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should save a new guild to the database", async () => {
    jest.setTimeout(45000);
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
    savedGuildId = savedGuild._id.toString(); // Convert ObjectId to string
    expect(savedGuild).not.toBeNull();
  });

  it("should update an existing guild in the database", async () => {
    jest.setTimeout(45000);

    const updatedGuild = await GuildModel.findByIdAndUpdate(
      savedGuildId,
      { "modules.notifications.enabled": false },
      { new: true }
    );

    expect(updatedGuild).not.toBeNull();
    expect(updatedGuild?.modules.notifications.enabled).toBe(false);
  });

  it("should find a guild by its id", async () => {
    jest.setTimeout(45000);

    const foundGuild = await GuildModel.findOne({ id: "test-guild-id" });

    expect(foundGuild).not.toBeNull();
    expect(foundGuild?._id.toString()).toBe(savedGuildId);
  });

  it("should delete an existing guild from the database", async () => {
    jest.setTimeout(45000);

    const deletedGuild = await GuildModel.findByIdAndDelete(savedGuildId);
    expect(deletedGuild).not.toBeNull();

    const findDeletedGuild = await GuildModel.findById(savedGuildId);
    expect(findDeletedGuild).toBeNull();
  });
});

it("should not save a guild with a missing id", async () => {
  jest.setTimeout(45000);

  const invalidGuild = new GuildModel({
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

  try {
    await invalidGuild.save();
  } catch (error: any) {
    expect(error).not.toBeNull();
    expect(error.errors.id).toBeDefined();
  }
});
