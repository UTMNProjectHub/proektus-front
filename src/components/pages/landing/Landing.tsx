import { Button } from "@/components/ui/button";
import { Archive, Users, Tag } from "lucide-react";
import { useNavigate } from "react-router";
import { useSanctum } from "react-sanctum";

function Landing() {
  const navigate = useNavigate();
  const { authenticated } = useSanctum();

  return (
     <div className="bg-gradient-to-b from-white to-gray-100 space-y-24 px-6 py-12 w-full min-h-[calc(100vh-8vh)]">
        {/* Hero Section */}
       <section className="relative text-center space-y-6 bg-blue-50 rounded-lg p-12 overflow-hidden">
         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full opacity-50 blur-3xl"></div>
         <div className="absolute bottom-0 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            Проектус — ваша <span className="text-blue-500">платформа</span> для хранения и коллаборации
          </h1>
          <p className="text-lg text-gray-600">
            Храните студенческие работы, объединяйтесь в команды и ищите нужные проекты с помощью нашего AI.
          </p>
          <Button onClick={() => authenticated ? navigate('/projects/create') : navigate('/signin')} size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
            Начать бесплатно
          </Button>
       </section>

        {/* Features Section */}
       <section className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg transition">
            <Archive className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Надёжное хранение</h3>
            <p className="text-gray-600">Безопасно сохраняйте все группы документов и проектов в одном месте.</p>
          </div>
         <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg hover:scale-105 transform transition">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl mb-2">Удобная коллаборация</h3>
            <p className="text-gray-600">Работайте вместе, используя наш файловый функционал</p>
          </div>
         <div className="flex flex-col items-center text-center p-6 border rounded-lg hover:shadow-lg hover:scale-105 transform transition">
            <Tag className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="font-semibold text-xl mb-2">AI-тегирование</h3>
            <p className="text-gray-600">Наш ИИ автоматически извлекает теги из текста для удобного поиска.</p>
          </div>
       </section>

        {/* Call to Action */}
       <section className="text-center space-y-4 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold">Готовы попробовать?</h2>
          <Button onClick={() => navigate('/signin')} size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            Создать аккаунт
          </Button>
       </section>
     </div>
  );
}

export default Landing;
