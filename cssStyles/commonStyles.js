// style.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Background color
    },
    content: {
        paddingHorizontal: 20, // Padding for the content
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
        resizeMode: 'contain', // Image resizing mode
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Title text color
    },
    input: {
        height: 40,
        borderColor: '#ccc', // Input border color
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    buttonContainer: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title5: {
        marginTop: 10,
        color: '#555', // Title5 text color
    },
    title5box: {
        marginTop: 10,
        color: '#555', // Title5 text color
    },
    socialIconContainer: {
        marginTop: 20, // Adjust the margin as needed
    },
});

export default styles;
