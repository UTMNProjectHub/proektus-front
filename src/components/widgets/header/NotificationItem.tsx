import React from 'react';
import {Link} from 'react-router'; // Corrected import
import {AlertCircle, CheckCircle, Zap, Eye, EyeOff} from 'lucide-react'; // Example icons

// Updated AppNotification interface
interface AppNotification {
    id: string;
    type: string;// This will come from the main part of the API response
    status: string; // from 'data',
    message: string; // This will come from the 'data' object in the API response
    project_id?: number; // from 'data'
    user_id?: number; // from 'data', could be the actor
    created_at: string; // from main API response
    read_at: string | null; // from main API response
}

interface NotificationItemProps {
    notification: AppNotification;
    onDismiss: (notification: AppNotification) => void; // Function to dismiss a notification
}

// Helper function to format date (optional, you can use a library like date-fns)
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const NotificationItem: React.FC<NotificationItemProps> = ({notification, onDismiss}) => {
    const getIcon = () => {
        // ... (keep existing icon logic or enhance)
        switch (notification.status) {
            case 'error':
                return <AlertCircle className="text-red-500" size={20}/>;
            case 'success':
                return <CheckCircle className="text-green-500" size={20}/>;
            default:
                return <Zap className="text-gray-500" size={20}/>;
        }
    };

    const getTitle = () => {
        // ... (keep existing title logic or enhance)
        switch (notification.status) {
            case 'success':
                return 'Файл обработан';
            case 'error':
                return 'Ошибка обработки файла';
            default:
                return notification.type.split('\\\\').pop() || 'Notification'; // Attempt to get a cleaner type name
        }
    };

    const isRead = notification.read_at !== null;

    return (
        <div
            className={`p-3 mb-2 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${isRead ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} dark:border-gray-600`}>
            <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-1 ${isRead ? 'opacity-60' : ''}`}>{getIcon()}</div>
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className={`text-sm font-semibold ${isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>{getTitle()}</h4>
                        <button
                            onClick={() => onDismiss(notification)}
                            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Dismiss notification"
                        >
                            &times;
                        </button>
                    </div>
                    <p className={`text-xs mt-1 ${isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>{notification.message}</p>
                    {notification.project_id && (
                        <Link
                            to={`/project/${notification.project_id}`}
                            className={`text-xs hover:underline mt-1 inline-block ${isRead ? 'text-blue-500 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400'}`}
                        >
                            Перейти к проекту
                        </Link>
                    )}
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center">
                        {isRead ? <Eye size={12} className="mr-1"/> :
                            <EyeOff size={12} className="mr-1 text-blue-500"/>}
                        {formatDate(notification.created_at) === 'Invalid Date' ? 'Новое уведомление' : formatDate(notification.created_at)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
export type {AppNotification};

