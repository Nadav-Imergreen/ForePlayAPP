import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { saveUrl, uploadImageToStorage, deletePhoto } from '../services/Databases/ImagesStorage';

const UploadImage = ({ setImageUrls, imageUrls }) => {

    const chooseImage = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        const response = await launchImageLibrary(options);
        if (response.didCancel) {
            console.log('WARNING: User cancelled image picker');
        } else if (response.errorCode) {
            console.log('WARNING: ImagePicker Error: ', response.errorMessage);
        } else {
            const uri = response.assets?.[0]?.uri;
            setImageUrls([...imageUrls, uri]); // Update the image URLs state in the parent component
            const uploadedURL = await uploadImageToStorage(uri)
            await saveUrl(uploadedURL);
        }
    };

    const deleteImage = (index) => {
        const newImageUris = [...imageUrls];
        newImageUris.splice(index, 1);
    
        setImageUrls(newImageUris); // Update the image URLs state in the parent component
        deletePhoto(index);
    };

    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }, (_, index) => {
                const uri = imageUrls[index];
                return (
                    <TouchableOpacity 
                        key={index} 
                        onPress={uri ? null : () => chooseImage(index)} // Disable onPress when there's a photo
                        disabled={!!uri} // Disable TouchableOpacity when there's a photo
                        style={[
                            styles.imageContainer, 
                            uri && { borderWidth: 0 }, // Remove border when uri is present
                        ]}
                    >
                        {uri ? (
                            <>
                                <Image source={{ uri }} style={styles.image} />
                                <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                                    <Text style={styles.pickedPlus}>+</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.addButton}>
                                <Text style={styles.plus}>+</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',    
    },
    imageContainer: {
        width: 100,
        height: 150,
        margin: 7,
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 10,
        borderStyle: 'dashed', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    addButton: {
        width: 35,
        height: 35,
        borderRadius: 25,
        backgroundColor: '#a4cdbd',
        borderWidth: 2,
        borderColor: "white",
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plus: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
    },
    deleteButton:{
        width: 30,
        height: 30,
        borderRadius: 25,
        backgroundColor: '#f06478',
        borderWidth: 2,
        borderColor: "white",
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Add position absolute to allow precise positioning
        bottom: -10, // Adjust bottom position as needed
        left: -10, // Adjust left position as needed
    },
    pickedPlus: {
        transform: [{ rotate: '45deg' }],
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default UploadImage;