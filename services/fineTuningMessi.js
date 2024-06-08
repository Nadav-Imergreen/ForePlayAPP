import {buildOpenaiURL} from './matchAI';
import {useState} from "react";

export const fineTuningMessi = async () => {
    try {
        const openai = buildOpenaiURL('/files');

        // Upload the file to OpenAI
        // return await openai.files.create({file: , purpose: 'fine-tune'});
    } catch (error) {
        console.log('Error in fine-tuning:', error);
    }
};
//
// export const fineTuningMess = async () => {
//     try {
//         const openai = buildOpenaiURL('/fine_tuning/jobs');
//         const file = fineTuningMessi();
//         const fineTune = await openai.fineTuning.jobs.create({ training_file: file.id, model: 'Messi-gpt-3.5-turbo' });
//         console.log('File uploaded successfully:', file);
//     } catch (error) {
//         console.log('Error in fine-tuning:', error);
//     }
// };







