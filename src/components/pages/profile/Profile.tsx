import {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router";
import GenericLoader from "@/components/ui/genericLoader.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import axios from "axios";
import {UserData} from "@/models/user/types.ts";

function Profile() {
  const [user, setUser] = useState<UserData>({} as UserData);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/profile").then((response) => {
        setUser(response.data.user);
    }).catch((error) => {
        if (error.response && error.response.status === 401) {
            navigate("/login");
        } else {
            console.error("Ошибка при загрузке профиля:", error);
        }
    })
  }, [navigate]);

  console.log(user);

  if (!user || Object.keys(user).length === 0) {
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
              <p>{user.surname} {user.firstname} {user.middlename}</p>
            </div>
            <div>
              <h3 className="font-semibold">Электропочта:</h3>
              <p>{user.email}</p>
            </div>
            <div>
              <h3 className="font-semibold">Юзернейм:</h3>
              <p>{user.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Роли:</h3>
              <ul className="list-disc list-inside">
                {user.roles && user.roles.map((role: { id: number; name: string }) => (
                  <li key={role.id}>{role.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Присоединились:</h3>
              <p>{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <Link to="/profile/edit">
              <Button>Редактировать</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Profile;