import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import styled from 'styled-components/native';

const App: React.FC = () => (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      <ScrollBody contentInsetAdjustmentBehavior="automatic">
        <Header />
        <Body>
          <SectionContainer>
            <SectionTitle>Step One</SectionTitle>
            <SectionDescription>
              Edit <Highlight>App.tsx</Highlight> to change this screen and then
              come back to see your edits.
            </SectionDescription>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>See Your Changes</SectionTitle>
            <SectionDescription>
              <ReloadInstructions />
            </SectionDescription>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Debug</SectionTitle>
            <SectionDescription>
              <DebugInstructions />
            </SectionDescription>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Learn More</SectionTitle>
            <SectionDescription>
              Read the docs to discover what to do next:
            </SectionDescription>
          </SectionContainer>

          <LearnMoreLinks />
        </Body>
      </ScrollBody>
    </SafeAreaView>
  </>
);

const ScrollBody = styled.ScrollView`
  background-color: ${Colors.lighter};
`;

const Body = styled.View`
  background-color: ${Colors.white};
`;

const SectionContainer = styled.View`
  margin-top: 32;
  padding-horizontal: 24;
`;

const SectionTitle = styled.Text`
  font-size: 24;
  font-weight: 600;
  color: ${Colors.black};
`;

const SectionDescription = styled.Text`
  margin-top: 8;
  font-size: 18;
  font-weight: 400;
  color: ${Colors.dark};
`;

const Highlight = styled.Text`
  font-weight: 700;
`;

export default App;
