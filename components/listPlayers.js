import React from 'react';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from 'native-base';
import styles from '../styles/globals';

const ListPlayers = props => {
  let { names } = props;
  return (
    <Content>
      <Container style={styles.main}>
        <List style={{ marginRight: 20 }}>
          {names &&
            names.map(name => {
              return (
                <ListItem avatar key={name.id}>
                  <Left>
                    <Thumbnail
                      source={require('../assets/images/spa-helmet-512.png')}
                    />
                  </Left>
                  <Body>
                    <Text>{name.name}</Text>
                    <Text note>Ready for Lift off.</Text>
                  </Body>
                  <Right>
                    <Text note> Player Ready.</Text>
                  </Right>
                </ListItem>
              );
            })}
        </List>
      </Container>
    </Content>
  );
};

export default ListPlayers;
