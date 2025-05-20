import React from 'react'
import { UserInfoList } from '../components'
import { User } from '../types/user'

const users: User[] = [
  {
    id: '1',
    name: 'Anderson',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    gender: 'Male',
    bio: "Creative photographer with a passion for capturing life's beautiful moments.",
  },
  // Add more users as needed
]

const Home: React.FC = () => (
  <UserInfoList users={users} />
)

export default Home

// const styles = StyleSheet.create({})