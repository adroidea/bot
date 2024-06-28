import { IGuild, createGuildObject } from 'adroi.d.ea';
import { IQuestions, QuestionsModel } from '../../src/modules/qotd/models';
import { connectDBForTesting, disconnectDBForTesting } from './connectDBForTesting';
import { Guild } from 'discord.js';
import { GuildModel } from '../../src/models';
import _sut from '../../src/modules/qotd/services/qotd.service';

describe('test mongoose Guild service', () => {
    const _mockDiscordGuild = {
        id: '1234567890',
        iconURL() {
            return 'https://example.com/icon.png';
        },
        ownerId: '0123456789'
    };

    beforeAll(async () => {
        await connectDBForTesting();
    });

    afterAll(async () => {
        await QuestionsModel.collection.drop();
        await GuildModel.collection.drop();
        await disconnectDBForTesting();
    });

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn());
    });

    it('should create a new QOTD', async () => {
        const qotd: IQuestions = {
            question: 'What is the best programming language?',
            authorId: '123456789',
            guildId: '987654321'
        };

        const newQotdId = await _sut.createQOtD(qotd);
        const createdQotd = await QuestionsModel.findById(newQotdId);

        expect(newQotdId).toBeDefined();
        expect(createdQotd).toBeDefined();
        expect(createdQotd?.question).toBe(qotd.question);
        expect(createdQotd?.authorId).toBe(qotd.authorId);
        expect(createdQotd?.guildId).toBe(qotd.guildId);
    });

    it('should throw an error when creating a new QOTD if no guildId is provided', async () => {
        const qotd: IQuestions = {
            question: 'What is the best programming language?',
            authorId: '123456789',
            guildId: ''
        };

        await expect(_sut.createQOtD(qotd)).rejects.toThrow();
    });

    it('should throw an error when creating a new QOTD if no authorId is provided', async () => {
        const qotd: IQuestions = {
            question: 'What is the best programming language?',
            authorId: '',
            guildId: '987654321'
        };

        await expect(_sut.createQOtD(qotd)).rejects.toThrow();
    });

    it('should throw an error when creating a new QOTD if no question is provided', async () => {
        const qotd: IQuestions = {
            question: '',
            authorId: '123456789',
            guildId: '987654321'
        };

        await expect(_sut.createQOtD(qotd)).rejects.toThrow();
    });

    it('should delete a QOTD', async () => {
        const qotd: IQuestions = {
            question: 'What is the best programming language?',
            authorId: '123456789',
            guildId: '987654321'
        };

        const newQotdId = await _sut.createQOtD(qotd);

        await _sut.deleteQOtDById(newQotdId);

        const deletedQotd = await QuestionsModel.findById(newQotdId);

        expect(deletedQotd).toBeNull();
    });

    it('should add a user to the QOTD blacklist', async () => {
        const guildData = new GuildModel(createGuildObject(_mockDiscordGuild as Guild));
        await guildData.save();

        await _sut.addToQotdBlacklist(_mockDiscordGuild.id, _mockDiscordGuild.ownerId);

        const guild: IGuild | null = await GuildModel.findOne({ id: _mockDiscordGuild.id });

        expect(guild).toBeDefined();
        expect(guild?.modules.qotd.blacklist).toContain(_mockDiscordGuild.ownerId);
        expect(guild?.modules.qotd.whitelist).not.toContain(_mockDiscordGuild.ownerId);
    });

    it('should throw an error when adding a user to the QOTD blacklist if the guild does not exist', async () => {
        await expect(_sut.addToQotdBlacklist('', _mockDiscordGuild.ownerId)).rejects.toThrow();
    });

    it('should add a user to the QOTD whitelist', async () => {
        const guildData = new GuildModel(createGuildObject(_mockDiscordGuild as Guild));
        await guildData.save();

        await _sut.whiteListUser(_mockDiscordGuild.id, _mockDiscordGuild.ownerId);

        const guild: IGuild | null = await GuildModel.findOne({ id: _mockDiscordGuild.id });

        expect(guild).toBeDefined();
        expect(guild?.modules.qotd.whitelist).toContain(_mockDiscordGuild.ownerId);
        expect(guild?.modules.qotd.blacklist).not.toContain(_mockDiscordGuild.ownerId);
    });

    it('should throw an error when adding a user to the QOTD whitelist if the guild does not exist', async () => {
        await expect(_sut.whiteListUser('', _mockDiscordGuild.ownerId)).rejects.toThrow();
    });
});
