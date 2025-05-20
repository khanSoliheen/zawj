import React from 'react'
import { UserInfoList } from '../components'
import { User } from '../types/user'

const users: User[] = [
  {
    id: '1',
    firstName: 'Anderson',
    middleName: 'James',
    lastName: 'Miller',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    gender: 'Male',
    bio: "Creative photographer with a passion for capturing life's beautiful moments.",
  },
  {
    id: '2',
    firstName: 'Sophia',
    middleName: 'Grace',
    lastName: 'Reynolds',
    avatarUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
    gender: 'Female',
    bio: 'UX designer focused on creating intuitive and accessible user experiences.',
  },
  {
    id: '3',
    firstName: 'Liam',
    middleName: 'Alexander',
    lastName: 'Bennett',
    avatarUrl: 'https://randomuser.me/api/portraits/men/23.jpg',
    gender: 'Male',
    bio: 'Front-end developer who loves building interactive web apps with React.',
  },
  {
    id: '4',
    firstName: 'Olivia',
    middleName: 'Marie',
    lastName: 'Cooper',
    avatarUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
    gender: 'Female',
    bio: 'Marketing strategist with a background in digital storytelling and branding.',
  },
  {
    id: '5',
    firstName: 'Noah',
    middleName: 'Thomas',
    lastName: 'Harrison',
    avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    gender: 'Male',
    bio: 'Software engineer and open-source contributor with a love for clean code.',
  },
  {
    id: '6',
    firstName: 'Emma',
    middleName: 'Rose',
    lastName: 'Foster',
    avatarUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    gender: 'Female',
    bio: 'Illustrator and visual artist creating whimsical and vibrant art pieces.',
  },
  {
    id: '7',
    firstName: 'James',
    middleName: 'David',
    lastName: 'Griffin',
    avatarUrl: 'https://randomuser.me/api/portraits/men/41.jpg',
    gender: 'Male',
    bio: 'Data analyst fascinated by uncovering insights through numbers and patterns.',
  },
  {
    id: '8',
    firstName: 'Ava',
    middleName: 'Elizabeth',
    lastName: 'Morgan',
    avatarUrl: 'https://randomuser.me/api/portraits/women/36.jpg',
    gender: 'Female',
    bio: 'Event planner who thrives on turning creative visions into memorable events.',
  },
  {
    id: '9',
    firstName: 'Elijah',
    middleName: 'Nathaniel',
    lastName: 'Wright',
    avatarUrl: 'https://randomuser.me/api/portraits/men/58.jpg',
    gender: 'Male',
    bio: 'Fitness coach and nutrition enthusiast focused on holistic wellness.',
  },
  {
    id: '10',
    firstName: 'Mia',
    middleName: 'Claire',
    lastName: 'Brooks',
    avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
    gender: 'Female',
    bio: 'Content writer and blogger sharing thoughts on productivity and minimalism.',
  },
];



const Home: React.FC = () => (
  <UserInfoList users={users} />
)

export default Home

// const styles = StyleSheet.create({})