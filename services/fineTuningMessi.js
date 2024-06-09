// import {buildOpenaiURL} from './matchAI';
// import {useState} from "react";
// import fineTuningExamples from '../fineTuningExamples.jsonl';
//
// export const fineTuningMessi = async () => {
//
//     try {
//         const openai = buildOpenaiURL('/files');
//
//         // Upload the file to OpenAI
//         return await openai.files.create({file: fineTuningExamples, purpose: 'fine-tune'});
//     } catch (error) {
//         console.log('Error in fine-tuning:', error);
//     }
// };
// //
// // export const fineTuningMess = async () => {
// //     try {
// //         const openai = buildOpenaiURL('/fine_tuning/jobs');
// //         const file = fineTuningMessi();
// //         const fineTune = await openai.fineTuning.jobs.create({ training_file: file.id, model: 'Messi-gpt-3.5-turbo' });
// //         console.log('File uploaded successfully:', file);
// //     } catch (error) {
// //         console.log('Error in fine-tuning:', error);
// //     }
// // };
//
//
//
//
//
//
//



// import { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import RNFS from 'react-native-fs';
// import ndjsonStream from 'can-ndjson-stream';
//
// const App = () => {
//     useEffect(() => {
//         const readJsonlFile = async () => {
//             try {
//                 const filePath = `${RNFS.DocumentDirectoryPath}/fineTuningExamples.jsonl`;
//                 const fileContent = await RNFS.readFile(filePath, 'utf8');
//
//                 const readableStream = new ReadableStream({
//                     start(controller) {
//                         controller.enqueue(new TextEncoder().encode(fileContent));
//                         controller.close();
//                     }
//                 });
//
//                 const reader = ndjsonStream(readableStream).getReader();
//                 let result;
//
//                 while (!(result = await reader.read()).done) {
//                     const jsonLine = result.value;
//                     console.log(jsonLine); // Do something with the JSON line object
//                 }
//             } catch (error) {
//                 console.error('Error reading or parsing the JSONL file:', error);
//             }
//         };
//
//         readJsonlFile();
//     }, []);
//
//     return (
//         <View>
//             <Text>Check console for output</Text>
//         </View>
//     );
// };
//
// export default App;