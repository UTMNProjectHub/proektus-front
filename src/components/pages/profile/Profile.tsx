import {useSanctum} from "react-sanctum";
import {useEffect} from "react";
import {useNavigate, Link} from "react-router";
import GenericLoader from "@/components/ui/genericLoader.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
//авааа
function Profile() {
  const {user, authenticated} = useSanctum();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated === false) {
      navigate('/401');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (authenticated === null) {
    return(
      <GenericLoader/>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {user && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Профиль</CardTitle>
            <CardDescription>Информация о вашем аккаунте.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">ФИО:</h3>
              <p>{user.data.surname} {user.data.firstname} {user.data.middlename}</p>
            </div>
            <div>
              <h3 className="font-semibold">Электропочта:</h3>
              <p>{user.data.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Юзернейм:</h3>
              <p>{user.data.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Роли:</h3>
              <ul className="list-disc list-inside">
                {user.data.roles.map((role: { id: number; name: string }) => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Присоединились:</h3>
              <p>{new Date(user.data.created_at).toLocaleDateString()}</p>
            </div>
            <Link to="/profile-edit">
              <Button>Редактировать</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Profile;