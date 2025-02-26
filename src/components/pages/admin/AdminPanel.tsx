import Header from "@/components/widgets/header/Header.tsx";

function AdminPanel() {
  const {user} = useSanctum();

  if (!user.data.roles.includes('admin')) {
    return 
  }

  return (
    <>
      <Header/>
      <Sidebar>

      </Sidebar>
    </>
  );
}

export default AdminPanel;