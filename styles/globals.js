const styles = {
  main: {
    backgroundColor: '#fcf4fa',
    flex: 1,
    alignContent: 'center'
  },
  mainTitle: {
    marginTop: 60,
    fontFamily: 'Orbitron',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 2
  },
  title: {
    fontFamily: 'Orbitron',
    fontSize: 30,
    textAlign: 'center',
    letterSpacing: 2
  },
  items: {
    marginLeft: 20,
    marginRight: 20
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain'
  },
  informativeText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#808080'
  },
  smallTitle: {
    fontFamily: 'Orbitron',
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 30
  },
  backButtonContainer: {
    marginTop: 20
    // marginBotttom: 20
  },
  backButton: {
    color: 'black'
  },
  lobbyContainer: {
    marginLeft: 20,
    marginRight: 20
  },
  centerOverlay: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topOverlay: {
    position: 'absolute',
    top: 35,
    left: 15,
    right: 0,
    bottom: 0,
    zIndex: 1000
  }
};

export default styles;
