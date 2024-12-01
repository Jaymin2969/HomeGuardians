import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradientBackground: {
      flex: 1,
      width: '100%',
    },
    mainWrapper:{
      flex: 1,
      marginHorizontal: 20,
      justifyContent: 'center',
    //   alignItems: 'center',
    },
    logoContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    logo: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: 1.5,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#fff',
      marginBottom: 30,
      textAlign: 'center',
    },
    label: {
      fontSize: 14,
      color: '#fff',
      marginBottom: 5,
      alignSelf: 'flex-start',
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
      backgroundColor: '#fff',
      color: '#333',
    },
    loginButton: {
      width: '100%',
      backgroundColor: '#fff',
      paddingVertical: 15,
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 20,
    },
    loginButtonText: {
      color: '#007BFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    footerText: {
      fontSize: 14,
      color: '#fff',
    },
    registerText: {
      fontSize: 14,
      color: '#fff',
      fontWeight: '600',
      marginLeft: 5,
    },
  });

  export default styles