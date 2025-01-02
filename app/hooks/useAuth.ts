export const useAuth = () => {
  const logout = () => {
    console.log('logout')
  }
  return {
    logout,
    token: '123',
  }
}
