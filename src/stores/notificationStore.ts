import { defineStore } from "pinia"

export type NotificationType = "chat" | "dm" | "admin"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  linkTo?: string // optional route to navigate to on click
}

// Demo items shown until real backend notifications arrive.
// Replace with real API data when backend support is added.
function demoItems(): AppNotification[] {
  const ago = (minutes: number) =>
    new Date(Date.now() - minutes * 60 * 1000).toISOString()
  return [
    {
      id: "demo-1",
      type: "admin",
      title: "Velkommen til Boost Move!",
      body: "Utforsk Movin-seksjonen for å starte din første Boost.",
      createdAt: ago(5),
      read: false,
      linkTo: "/movin",
    },
    {
      id: "demo-2",
      type: "dm",
      title: "Ny direktemelding",
      body: "Du har mottatt en melding fra en kollega.",
      createdAt: ago(42),
      read: false,
      linkTo: "/chat",
    },
    {
      id: "demo-3",
      type: "chat",
      title: "Ny melding i teamchat",
      body: "Det er aktivitet i gruppechatten din.",
      createdAt: ago(180),
      read: true,
      linkTo: "/chat",
    },
  ]
}

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    items: demoItems() as AppNotification[],
  }),

  getters: {
    unreadCount: (s): number => s.items.filter((n) => !n.read).length,

    sorted: (s): AppNotification[] =>
      [...s.items].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
  },

  actions: {
    push(n: Pick<AppNotification, "type" | "title" | "body" | "linkTo">) {
      this.items.unshift({
        id: crypto.randomUUID(),
        type: n.type,
        title: n.title,
        body: n.body,
        createdAt: new Date().toISOString(),
        read: false,
        linkTo: n.linkTo,
      })
    },

    markRead(id: string) {
      const n = this.items.find((n) => n.id === id)
      if (n) n.read = true
    },

    markAllRead() {
      this.items.forEach((n) => (n.read = true))
    },

    dismiss(id: string) {
      this.items = this.items.filter((n) => n.id !== id)
    },

    clearAll() {
      this.items = []
    },
  },
})
