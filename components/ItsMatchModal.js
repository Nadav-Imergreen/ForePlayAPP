import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createConversation, getUserConversations } from '../services/Databases/chat';

const ItsMatchModal = ({ visible, user1, user2, onClose, navigation, conversationId  }) => {

    //const navigation = useNavigation();

    const goToChat = async () => {
        try {
            console.log(conversationId);
            navigation.navigate('Chat', { conversationId: conversationId });
        } catch (error) {
            console.error('Error navigating to chat:', error);
        }
    };

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
                    <TouchableOpacity style={styles.button} onPress={goToChat}>
                        <Text style={styles.buttonText}>Go to chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.laterText}>Maybe Later</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
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
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 10,
        elevation: 5,
        width: 200,
        marginTop: 10,
    },
    buttonText: {
        color: '#f2647a',
        fontSize: 16,
        textAlign: 'center',
    },
    laterText: {
        marginTop: 10
    }
});

export default ItsMatchModal;