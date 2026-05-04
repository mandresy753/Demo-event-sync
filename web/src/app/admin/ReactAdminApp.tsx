"use client";

import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  NumberField,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import authProvider from "@/lib/authProvider";

const dataProvider = simpleRestProvider("/api");

const EventList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="location" />
      <TextField source="startDate" />
      <TextField source="endDate" />
    </Datagrid>
  </List>
);

const SessionList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="startTime" />
      <TextField source="endTime" />
    </Datagrid>
  </List>
);

const QuestionList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="content" />
      <TextField source="author" />
      <NumberField source="votes" />
      <TextField source="sessionId" />
    </Datagrid>
  </List>
);

const SpeakerList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="bio" />
      <TextField source="photoUrl" />
    </Datagrid>
  </List>
);

export default function ReactAdminApp() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="events" list={EventList} />
      <Resource name="sessions" list={SessionList} />
      <Resource name="questions" list={QuestionList} />
      <Resource name="speakers" list={SpeakerList} />
    </Admin>
  );
}