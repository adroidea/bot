import { Queue } from 'bullmq';
import { connection } from '../../../..';

const connectionOptions = {
    connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
    }
};

const jailQueue = new Queue('jailQueue', connectionOptions);

export default jailQueue;
