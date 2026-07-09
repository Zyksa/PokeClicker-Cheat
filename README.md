# ⚡ PokéClicker Save Editor

> **Un éditeur de sauvegarde visuel et complet pour [PokéClicker](https://pokeclicker.com/)** — modifiez tous les aspects de votre partie depuis une interface moderne sans toucher une ligne de code.

![Preview](public/favicon.svg)

---

## ✨ Fonctionnalités

| Catégorie | Description |
|---|---|
| 👤 **Profil dresseur** | Modifiez le nom, le sprite, la couleur du texte, la région actuelle et la progression |
| 🪙 **Portefeuille & Monnaies** | Éditez les 7 monnaies : Pokédollars, Points Quête, Jetons Donjon, Diamants, BP, Points Ferme, Tickets Concours |
| 🎒 **Objets Clés** | Activez/désactivez tous les objets clés : Town Map, Dungeon Ticket, Explorer Kit, Safari Ticket, etc. |
| 🔮 **Objets d'Oak** | Configurez le niveau et l'expérience des 12 objets d'Oak (Shiny Charm, Exp Share, Magma Stone...) |
| 👾 **Pokémon** | Parcourrez, recherchez et modifiez tous vos Pokémon capturés — statut shiny, expérience, vitamines. Ajoutez ou supprimez des Pokémon. **Attrapez-les tous** en un clic. |
| ⛏️ **Souterrain & Ferme** | Gérez l'expérience minière, la durabilité des outils, les pierres évolutives, les baies et les pelles |

### ⚡ Actions rapides

- **💰 Max Currencies** — Plafonnez les 7 monnaies à 999 999 999
- **✨ Shiny All** — Transformez tous vos Pokémon capturés en chromatiques
- **🎒 Unlock All Key Items** — Débloquez tous les objets clés en un clic
- **🔮 Max Oak Items** — Niveau max pour tous les objets d'Oak

---

## 🚀 Utilisation

### En ligne (site hébergé)

Rendez-vous sur **[l'instance hébergée](https://pokeclicker-cheat.netlify.app/)** — pas d'installation, ça marche dans le navigateur.

1. **Exportez** votre sauvegarde depuis PokéClicker (`Options → Export Save`)
2. **Glissez-déposez** le fichier ou collez le code Base64 dans l'éditeur
3. **Modifiez** ce que vous voulez (monnaies, Pokémon, objets...)
4. **Exportez** le nouveau code et importez-le dans PokéClicker (`Options → Import Save`)

### En local

```sh
git clone https://github.com/zyksa/pokeclicker-cheat
cd pokeclicker-cheat
npm install
npm run dev
```

Ouvrez `http://localhost:4321` dans votre navigateur.

---

## 🧞 Commandes

| Commande | Action |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Démarre le serveur de dev sur `localhost:4321` |
| `npm run build` | Construit le site de production dans `dist/` |
| `npm run preview` | Prévisualise le build local |

---

## 🛠️ Stack technique

- **[Astro](https://astro.build/)** — Framework web
- **[React](https://react.dev/)** — Composants interactifs
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Styles
- TypeScript, Base64, déploiement statique

---

## ⚠️ Avertissement

Cet outil modifie votre fichier de sauvegarde PokéClicker. **Faites toujours une sauvegarde** de votre fichier original avant d'importer une sauvegarde modifiée. L'utilisation excessive des fonctionnalités peut réduire l'intérêt du jeu.

PokéClicker © les contributeurs de PokéClicker. Ce projet est un outil communautaire non officiel.

---

## 📄 Licence

MIT
