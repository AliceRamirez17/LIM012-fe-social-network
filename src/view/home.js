/* eslint-disable import/no-cycle */
import { changeView } from '../view-controller/router.js';
import { signOut } from '../firebase-controller.js';
import { publishComment } from '../firestore-controller.js';
import { db, storage} from '../main.js';

export default () => {

  
  const userName = firebase.auth().currentUser.displayName;
  const photoURL = firebase.auth().currentUser.photoURL;

  const viewSignInUser = document.createElement('div');
  viewSignInUser.innerHTML = `
    <header class="header-home">
      <nav class="nav-home">
        <ul class="menu-home">
          <li class="btnHeader" id="btnProfile">Perfil</li>
          <li class="btnHeader" id="btnSignOut">Cerrar sesión</li>
        </ul>
      </nav>
      <button class="btnHome"><a href="#/home"></a></button>
    </header>
    <section class="containerHome">
      <div class="profileSection">
        <div class="coverImage"></div>
        <div class="profile">
          <div class="profileDiv">
            <div class="profilePicture">
                  <img id="profilePhoto" class="imgPhotoURL" src="${photoURL}" alt="">
            </div>
            <p class="userProfile">${userName}</p>
          </div>
          <h3>Sobre mí</h3>
          <p class="description">Nemo enim ipsam voluptem quia voluptas sit asper aut odit aut fugit.</p>
        </div>
        <div class="divWhite"></div>
      </div>
      <div class="timeline">
        <div class="post">
        <img id="showPicture" class="post-image" src="#" alt=""><br>
          <textarea class="new-post" id="newPost" placeholder="¿Qué quisieras compartir?"></textarea>
            <div class="buttons-post">

              <label for="selectImage">
              <input type="file" id="selectImage" class="upload" accept="image/jpeg, image/png">
              <img class ="point-photo" src="./img/add-photo.png">
              </label> 
              <img id="choosePrivacity" src="./img/status.png">

              <button id="btnNewPost" class="button-right">Publicar</button>
            </div>
        </div>
        <div class="all-posts" id="allPosts"></div>
      </div>
    </section>`;

  
  const selectImage = viewSignInUser.querySelector('#selectImage');
  const showPicture = viewSignInUser.querySelector('#showPicture');
  const newPost = viewSignInUser.querySelector('#newPost');
  
  
  // Vista previa de imagen cargada
  /*
  selectImage.addEventListener('change', (event) => {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      showPicture.src = dataURL;
      newPost.classList.add('hide');
    };
    reader.readAsDataURL(input.files[0]);
    */


    // Seleccionar imagen y guardarla en Storage
    selectImage.addEventListener('change', (e) => {
    // Obtener el archivo
    const file = e.target.files[0];
    
    // Crea referencia de almacenamiento
    let storageRef = storage.ref('images/' + file.name);
    
    // Subir archivo
    storageRef.put(file);

 });

 



  // // Guarda nombre y post del usuario en la Base de datos
  // btnToPost.addEventListener('click', () => {
  //   const postText = viewSignInUser.querySelector('#postText').value;
  //   firebase.firestore().collection("publicaciones").add({
  //   user: userName,
  //   post: postText,
  //   })
  //   .then((docRef) => {
  //       //  btnToPost.disabled=true;
  //       console.log("Document written with ID: ", docRef.id);
  //   })
  //   .catch((error) => {
  //       console.error("Error adding document: ", error);
  //   });
  // });


   const btnSignOut = viewSignInUser.querySelector('#btnSignOut');
  btnSignOut.addEventListener('click', () => {
    changeView('#/signin');
    signOut();
  });

  const btnProfile = viewSignInUser.querySelector('#btnProfile');
  btnProfile.addEventListener('click', () => {
    changeView('#/profile');
  });

  const btnNewPost = viewSignInUser.querySelector('#btnNewPost');
  btnNewPost.addEventListener('click', () => {
    publishComment();
  });

  // Leyendo datos del database

  const allPosts = viewSignInUser.querySelector('#allPosts');
  db.collection('posts').onSnapshot((querySnapshot) => {
    allPosts.innerHTML = '';
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      allPosts.innerHTML += `
      <div class="each-post">
        <p>${doc.data().name}</p>
        <p>${doc.data().post}</p>
        <div class="container-menu-post">
          <input type="checkbox" id="menu-post" class="hide">
          <label for="menu-post" class="label-menu-post"></label>
          <nav class="hide" id="nav-post">
            <ul class="menu-post">
              <li class="btn-post-edit" id="btnPostEdit">Editar</li>
              <li class="btn-post-delete" id="btnPostDelete">Eliminar</li>
            </ul>
          </nav>
        </div>
      </div>
      `;

      const menuPost = viewSignInUser.querySelector('#menu-post');
      menuPost.addEventListener('click', () => {
        const navPost = viewSignInUser.querySelector('#nav-post');
        if (menuPost.checked === true) {
          navPost.classList.remove('hide');
        } else if (menuPost.checked === false) {
          navPost.classList.add('hide');
        }
      });
    });
  });

  // Borrando datos del database

  // const btnViewHome = viewSignInUser.querySelector('#btnHome');
  // btnViewHome.addEventListener('click', () => {
  //   changeView('#/home');
  // });

  return viewSignInUser;
};
