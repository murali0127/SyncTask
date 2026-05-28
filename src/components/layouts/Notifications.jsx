import { CircleXIcon } from "lucide-react";
import "./header.css";

export default function Notifications() {
      //MOCK DATA'S
      const notifications = [
            {
                  id: 1,
                  title: "Task Completed",
                  message: "UI redesign task marked as complete.",
                  time: "2 min ago",
            },
            {
                  id: 2,
                  title: "New Reminder",
                  message: "Project meeting starts in 30 minutes.",
                  time: "10 min ago",
            },
            {
                  id: 3,
                  title: "AI Suggestion",
                  message: "3 overdue tasks detected.",
                  time: "1 hour ago",
            },
      ];

      return (

            <div className="notification-dropdown">

                  {/* HEADER */}
                  <div className="notification-header">

                        <h3>Notifications</h3>

                        <span className="notification-count bg-neutral-600 py-1">
                              {notifications.length}
                        </span>

                  </div>

                  {/* BODY */}
                  <div className="notification-body">

                        {notifications.map((item) => (

                              <div
                                    key={item.id}
                                    className="notification-card"
                              >



                                    <div className="notification-content">

                                          <div className="notification-top">

                                                <h4>{item.title}</h4>

                                                <span>{item.time}</span>

                                          </div>

                                          <p>{item.message}</p>

                                    </div>

                              </div>
                        ))}

                  </div>

                  {/* FOOTER */}
                  <div className="notification-footer">

                        <button className="flex justify-center align-center gap-2">
                              close <CircleXIcon className="mt-1" size="17px" />
                        </button>

                  </div>

            </div>
      );
}