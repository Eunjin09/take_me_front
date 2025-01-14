import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { deleteCookie } from "../../shared/cookie";

import Header from "../public/Header";
import { useDispatch, useSelector } from "react-redux";
import { getInfo, infoUpdate } from "../../store/modules/myInfo";
import { nickCheckDB, emailCheckDB } from "../../store/modules/login";
import { ReactComponent as Edit } from "../../assets/icons/EditMint.svg";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const title = '프로필 편집'
  const infoState = useSelector((state) => state.myInfo.infoList);
  console.log(infoState);


  useEffect(() => {
    dispatch(getInfo());
    if (!localStorage.getItem("accessToken")) {
      navigate("/main")
    }
  }, [dispatch])


  const introDescRef = useRef(null);
  const nickRef = useRef();
  // const fileRef = useRef();

  const [image, setImage] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    setImage(infoState.profileImg)
    setEmail(infoState.email)
    setPreviewImg(infoState.profileImg)
  }, [infoState])

  //소셜 아이디 확인
  const idCheck = () => {
    if (infoState.username?.includes('google')) {
      return 'google 회원';
    }
    if (infoState.username?.includes('kakao')) {
      return 'kakao 회원';
    }
    return infoState.username
  }


  // 이미지 업로드
  const imageUpLoad = async (e) => {
    imagePreview(e.target.files[0]);
    setPreviewImg(e.target.files[0]);
  }


  const infoChange = () => {
    if (infoState.nickname !== nickRef.current.value) {
      const confirm = nickResult.includes('사용');
      if (!confirm) {
        setnNickTitle("알림")
        setNickToggles(true);
        setNickResult("닉네임 중복체크를 확인해주세요.")
        return
      }
    }

    const introDesc = introDescRef.current.value;
    const nick = nickRef.current.value;

    const formData = new FormData();
    formData.append('image', previewImg);

    const changeInfo = {
      introDesc: introDesc,
      nickname: nick,
      email: email,
    }
    const json = JSON.stringify(changeInfo);
    const blob = new Blob([json], { type: "application/json" });
    formData.append('changeInfo', blob);

    dispatch(infoUpdate(formData));
    window.alert("프로필이 변경되었습니다.")
    window.location.reload();
  }



  // 미리보기
  const imagePreview = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage(reader.result);
        resolve();
      }
    })
  }

  // 이메일 중복체크 / 토클
  const emailRef = useRef();
  const [userNickAlert, setUserNickAlert] = useState('');

  const [onToggle, setOnToggle] = useState(false);
  const [focus, setFocus] = useState(true);
  const [checkEmail, setCheckEmail] = useState("disabled");
  const [userIdAlert, setUserIdAlert] = useState("disabled");



  const [idColor, setIdColor] = useState(null);
  const [navToggles, setNavToggles] = useState(false);
  const [resultAlert, setResultAlert] = useState("");

  const closeNav = (e) => {
    setNavToggles(false);
    setResultAlert("");
  }


  const active = (e) => {
    setOnToggle(true);
    setFocus(false);
  }

  const emailCheck = (e) => {
    const emailText = emailRef.current.value;
    const emailCheckStr = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (emailCheckStr.test(emailText)) {
      dispatch(emailCheckDB(emailText, setResultAlert))
    } else {
      setResultAlert("🚨이메일 형식으로 적어주세요")
    }
  }

  // 로그아웃
  const logout = (e) => {
    localStorage.clear();
    deleteCookie('refreshToken');
    navigate('/login')
  }

  // 닉네임 중복 검사
  const nickCheckStr = /^[a-zA-Zㄱ-힣0-9-_.]{2,12}$/;

  const [nickToggles, setNickToggles] = useState(false);
  const [nickResult, setNickResult] = useState("");
  const [nickTitle, setnNickTitle] = useState("");

  const nickClose = (e) => {
    setNickToggles(false);
  }

  const nickActive = (e) => {
    setNickToggles(true);
    // setFocus(false);
    const nick = nickRef.current.value;
    setnNickTitle("닉네임 변경")
    if (infoState.nickname === nick) {
      return setNickResult("기존 닉네임입니다.")
    }
    if (nickCheckStr.test(nick)) {
      dispatch(nickCheckDB(nick, setNickResult))
    } else {
      setNickResult("2~11글자, 특수문자를 제외하고 작성해주세요.")
    }
  }



  // 이메일 중복검사 팝업
  const changeEmail = (e) => {
    e.preventDefault();
    const emailText = emailRef.current.value;
    if (resultAlert.includes("사용")) {
      setEmail(emailText);
      setNavToggles(false);
    } else {
      setResultAlert("중복체크를 확인해주세요!")
    }
  }


  const emailEdit = (e) => {
    e.preventDefault();
    setNavToggles(true)
  }




  return (
    <>
      {navToggles ?
        <ModalWrap>
          <ModalBox>
            <h1>이메일 변경</h1>
            <CloseBtn onClick={closeNav}>
              <span></span>
              <span></span>
            </CloseBtn>
            <div className="cont">
              <input
                type="text"
                defaultValue={email}
                ref={emailRef}
                onChange={() => { setResultAlert('') }} />
              <button onClick={emailCheck}>중복체크</button>
            </div>
            <p>{resultAlert}</p>
            <button className="change" onClick={changeEmail}>변경하기</button>
          </ModalBox>
        </ModalWrap>
        : null
      }
      {nickToggles ?
        <ModalWrap>
          <ModalBox>
            <h1>{nickTitle}</h1>
            <CloseBtn onClick={nickClose}>
              <span></span>
              <span></span>
            </CloseBtn>
            <div className="cont">
              {nickResult}
            </div>
            <button className="change" onClick={nickClose}>확인</button>
          </ModalBox>
        </ModalWrap>
        : null
      }
      <Header title={title} />
      <ProflieWrap>
        <MyInfo>
          <ProflieImg>
            <div><img src={image} alt="" /></div>
            <label htmlFor="file">
              <Edit />
            </label>
            <input type="file" id="file" className="icon"
              onChange={imageUpLoad}
              multiple="multiple"
              accept=".jpg, .png, image/jpeg, .svg" />
          </ProflieImg>
          <Nick idStr={idColor}>
            <div>
              <input type="textarea"
                defaultValue={infoState.nickname}
                ref={nickRef}
                maxLength="11"
                onChange={() => {
                  setNickResult('')
                }}
              />
              <button onClick={nickActive}>중복체크</button>
            </div>
            <span className="box"> 님</span>
            <p className="idResult">{userNickAlert}</p>
          </Nick>
          <input type="text" className="word" maxLength="32" ref={introDescRef} defaultValue={
            infoState.introDesc === null ?
              "기본 소개글" : infoState.introDesc
          }>
          </input>
        </MyInfo>
        <SubInfo>
          <div>
            <span>아이디</span>
            <p>{idCheck()}</p>
          </div>
          <div>
            <span>이메일</span>
            <h2 className="email">{email}</h2>
            <div className="editBtn" onClick={active}>
              <Edit onClick={emailEdit} />
            </div>
          </div>
        </SubInfo>
        <Btn>
          <EditBtn onClick={infoChange}>적용하기</EditBtn>
          <LoginOutBtn onClick={logout}>로그아웃</LoginOutBtn>

        </Btn>
      </ProflieWrap>
    </>
  )
};


export default Profile;

const ProflieWrap = styled.div`
width: 100%;
height: 95.6%;;
/* padding: 0 25px; */
text-align: left;
background : #F8F8F8;
button {
  cursor: pointer;
}
`

const MyInfo = styled.div`
width: 100%;
height: 19.6rem;
padding: 10px;
text-align: center;
background: #fff;
padding: 20px 25px;

.word {
  padding: 10px;
  font-size: 0.87rem;
  color: #26DFA6;
  line-height: 1.12rem;
  font-weight: 700;
  border: 1px solid #ccc;
  border-radius : 5px;
  width: 100%;
  letter-spacing: -0.15px;
  font-weight: 500;
  font-family: 'Noto Sans KR', sans-serif;
}
input:focus {
  outline: #ccc;
}
`

const Nick = styled.div`
font-weight: bold;
font-size: 1.5rem;
margin: 10px 0px;
div {
  color:#26DFA6;
  display: inline;
  position: relative;
}
.box{
  display: inline;
}
input{
  border: 1px solid #ccc;
  background: #fff;
  color: #26DFA6;
  width: 91%;
  font-weight: 700;
  font-size:1.365rem;
  padding-left: 15px;
  border-radius: 2.43rem;
}
button{
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4.43rem;
  text-align: center;
  color: #999;
  padding: 3px 5px;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid #dbdbdb;
  border-radius: 3.12rem;
}
`

const ProflieImg = styled.div`
  position: relative;
  width: 10.6rem;
  height: 10.6rem;
  background: #d9d9d9;
  margin: auto;
  border-radius: 50%;
  div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    overflow: hidden;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: #666;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
  }
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .icon{
    position: absolute;
    right: 0; bottom:0;
    border-radius: 50%;
    background: #666;
  }
  input[type="file"] {
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}
`

const SubInfo = styled.div`
padding: 30px 25px; 
text-align: left;

div {
  position: relative;
  margin-bottom: 20px;
}
span {
  font-size: 1rem;
}
p{
  display: inline-block;
  padding-left: 20px;
  font-weight: 700;
}

div.editBtn{
  position: absolute;
  right: 0; top: 5%;
  cursor: pointer;

  path {
    fill: #333;
  }
}
.email{
  display: inline-block;
  margin-left : 20px;
  font-weight: 700;
  font-size: 1rem;
  color: #000;
}
  .result {
  display: inline-block;
  padding-left: 66px;
}
`

const Btn = styled.div`
padding: 0 25px;
position: absolute;
bottom: 40px; left: 50%;
transform: translateX(-50%);
width: 100%;
text-align: center;
`
const EditBtn = styled.button`
color: #fff;
border: none;
background: #26DFA6;
font-size: 0.93rem;
font-weight: 700;
height: 50px;
line-height: 50px;;
border-radius: 32px;
width: 100%;
`
const LoginOutBtn = styled.button`
text-decoration: underline;
color: #999;
letter-spacing: 0.03px;
border: none;
background: none;
font-size: 1.12rem;
font-weight: 700;
padding: 22px 0;

`


// 모달
const ModalWrap = styled.div`
width: 100%;
height: 100vh;
padding: 0 25px;
position: absolute;
top: 0; left: 0;
background: rgba(0,0,0,0.7);
z-index: 999;
`
const ModalBox = styled.div`
position: absolute;
top: 50%; left: 50%;
transform: translate(-50%,-50%);
width: 90%;
height: 12.12rem;
background: #fff;
border-radius: 5px;
overflow: hidden;

h1 {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  line-height:62px;
}
 h3 {
  font-size: 1.5rem;
  padding: 20px 0;
  white-space: pre-wrap;
 }
 p{
  text-align: center;
  padding-top: 5px;
 }
 div.cont{
  position: relative;
  margin: 0 10px;
  padding: 15px 0;
  border-bottom : 1px solid #ddd;
  text-align: center;
  button{
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 4.43rem;
    text-align: center;
    color: #999;
    padding: 3px 5px;
    font-weight: 500;
    font-size: 0.875rem;
    border: 1px solid #dbdbdb;
    border-radius: 3.12rem;
  }
 }
 input {
  width: 75%;
  background : none;
  border: none;
  text-align: center;
 }
 input:focus{
  outline:none;
 }
 button.change {
  font-size:0.93rem;
  font-weight: 700;
  color: #fff;
  width: 100%;
  background: #26DFA6;
  padding: 16px 0;
  position: absolute;
  bottom: 0; left: 0;
 }
`

const CloseBtn = styled.div`
width:15px;
height: 15px;
position:absolute;
top: 13px; right: 5%;

span {
  display:block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width:100%;
  height:1px;
  background-color: #999999;
}
span:first-child{
  transform: rotate(45deg) translateX(0%);
  }
span:last-child{
  transform: rotate(135deg) translateX(0%);
  }
`;
