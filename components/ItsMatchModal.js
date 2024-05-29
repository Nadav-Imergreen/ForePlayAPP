import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const ItsMatchModal = ({ visible, user1, user2, onClose }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>It's a Match!</Text>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: user1.images[0] }} style={styles.image} />
                        <Image source={{ uri: user2.images[0] }} style={styles.image} />
                    </View>
                    <Text style={styles.message}>You and {user2.firstName} liked each other!</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Go to Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    imageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginHorizontal: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: 150,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ItsMatchModal;