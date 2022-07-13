import React,{ useState,useEffect,useRef}from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ListModal from "../components/ListModal";
import PostModal from "../components/PostModal";
import { useSelector } from "react-redux/es/exports";
import { loadpostsAc,deletePostAc } from "../redux/modules/post";
import { useNavigate, useParams } from "react-router-dom"
import { loadsavedAc } from "../redux/modules/saved";
import {getUserInfoDB} from "../redux/modules/user";
import Like from "./Like";
import { loadMoreContentDB } from "../redux/modules/post";

const CommunityTab = () => {

  React.useEffect(() => {
    dispatch(loadpostsAc())
    dispatch(getUserInfoDB())
  }, [])

  const dispatch = useDispatch();
  const Navigate = useNavigate();
  
  const  [savedListIndex, setSavedListIndex] = useState();
  const userinfo = useSelector((state) => state.user.infoList)
  console.log(userinfo,"userinfo")
  const Postdata = useSelector((state) => state.post.postList.data);
  console.log(Postdata, "postdata")

  const Savedata = useSelector((state) => state.saved.savedItem);

  const [showModall, setShowModall] = useState(false);
  const openModall = (index) => {
    setSavedListIndex(index);   
    setShowModall(true)
  }
  const closeModall = () => {
    setShowModall(false);
  }
  const [showModalll, setShowModalll] = useState(false);
  const openModalll = () => {
    setShowModalll(true)
  }
  const closeModalll = () => {
    setShowModalll(false);
  }
  const [isEdit, setIsEdit] = useState(false);
  const openEdit = () => {
    setIsEdit(true)
  }
  const editPost = (index) => {
    window.location.replace(`/community/${index}`);
  }

  const [iLike, setILike] = useState(false);
  const clickLike = () => {
    setILike(true)
  }
  
  const [target, setTarget] = useState(null);
  const onIntersect = async ([entry], observer) => {
      if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          await dispatch(loadMoreContentDB());
      }
  };

  useEffect(() => {
      let observer;
      if (target) {
          observer = new IntersectionObserver(onIntersect, {
              threshold: 1,
          });
          observer.observe(target);
      }
      return () => {
          observer && observer.disconnect();
      };
  }, [target]);
  console.log(Postdata,"확인")


  return (
    <Box>
      {Postdata.map((postList, index) => {
        return (
          <div key={postList.boardId} ref={index === Postdata.length - 1 ? setTarget : null}> 
            <>
              <ContentBox>
                <Left>
                  {/* <Day>{postList.createAt}</Day> */}
                  <ItemImage></ItemImage>
                  <Profile /*src={postList.profileImg}*/></Profile>
                </Left>
                <Right>
                  <Top>
                    <GoalName onClick={() => {
                      Navigate(`/detail/${index.boardId}`)
                    }}>
                      {postList.goalItemName}
                    </GoalName>
                  </Top>
                  <Middle>
                    <Nick onClick={() => { Navigate(`/detail/${index}`) }}>
                      {postList.nickname}&nbsp;&nbsp;{postList.contents}
                    </Nick>
                  </Middle>
                  <Foot>
                    <Like
                      isLike={postList.checkLike}
                      forLikeId = {postList.boardId}
                      likeCount = {postList.likeCount}
                    />
                    <div style={{ marginLeft: "1rem" }}>💬</div>
                    <div onClick={() => {
                      Navigate(`/detail/${postList.boardId}`)
                      }}>
                      댓글 00 개 모두 보기</div>
                    <div onClick={()=>{openModall(index)}} style={{ marginLeft: "auto" }}>📃</div>
                  </Foot>
                </Right>
              </ContentBox>
            </>
          </div>
        )
      }
      )}
      <BlankBox></BlankBox>



         <BtnBox>
        <FootBtn onClick={openModalll}>내 태산 % 공유</FootBtn>

        {/* 세이브리스트모달 */}
        {showModall ?
            <ListModal showModall={showModall} closeModall={closeModall} 
                        forsaveId = {Postdata[savedListIndex].boardId}
                        />
            : null}
        {/* 게시글등록모달     */}
        {showModalll ?
          <PostModal showModalll={showModalll} closeModalll={closeModalll}
        //   savedList = {postList.boardId}
          />
        : null}

        </BtnBox>
    </Box>
)
};

const CreatAt = styled.div`
width: 28vw;
height: 10vw;
background-color: rgb(100,100,100, 0.2);
border-radius: 0 0 50vw 50vw;
position: relative;
float: inline-end;
margin-top: 69%;
`;

const Box = styled.div`
width: 100%;
height: 1389px;
/* border: 1px solid black; */
border: none;
margin: auto;
display: flex;
flex-direction: column;
`;

const Header = styled.div`
width: 100%;
height: 10vh;
/* border: 1px solid black; */
`;

const ContentBox = styled.div`
width: 100%;
height: 20vh;
padding: 1rem;
/* border: 3px solid blue; */
border: none;
display: flex;
flex-direction: row;
`;

const Left = styled.div`
width: 35%;
/* border: 2px solid red; */
border: none;
position: relative;
`;

const Profile = styled.img`
width: 35px;
height: 35px;
background-color: gray;
border-radius: 35px;
border: none;
position: absolute;
top: 5%
`;

const Nick = styled.div`
border: 1px solid red;
display: flex;
text-overflow: ellipsis;  
	overflow : hidden;
	display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;

`;

const Day = styled.div`
font-size: 1.5rem;
margin-left: auto;
`

const ItemImage = styled.div`
width: 110px;
height: 110px;
border: 1px solid red;
margin: 0 auto;
border-radius: 50rem;
position: absolute;
top: 5%
`;

const Foot = styled.div`
width: 100%;
height: 3vh;
/* border: 1px solid violet; */
display: flex;
margin: auto;
align-items: flex-end;
font-size: 0.5rem;
padding: 1rem;
`;

const Modalbtn = styled.button`
border: none;
background-color: transparent;
font-size: 0.5rem;
`;

const BtnBox = styled.div`
width: 100%;
height: 8vh;
margin: 0 auto;
display: flex;
justify-content: center;
align-items: center;
bottom: 5%;
position: fixed;
/* left: 39% */

`;

const FootBtn = styled.button`
width: 90%;
height: 8vh;
border-radius: 2rem;
border: none;
font-size: 1.3rem;
color: white;
font-weight: 500;
/* background-color: rgb(38, 223, 116, 0.2); */
background-color: #26DFA6;
/* box-shadow: rgb(0 0 0 / 9%) 0px 2px 12px 0px; */
box-shadow: 5px 5px 5px rgb(110, 110, 110, 0.4);
`;

const Right = styled.div`
width: 65%;
/* border: 2px solid violet; */
`;

const Middle = styled.div`
width: 100%;
height: 10vh;
/* border: 1px solid black; */
font-size: 0.7rem;
line-height: 0.9rem;
letter-spacing: 0.04rem;
padding: 0 1rem;

`;

const Top = styled.div`
width: 100%;
/* border: 1px solid blue; */
display: flex;
justify-content: end;
padding: 0 1rem;
`;

const GoalName = styled.div`
width: 85%;
font-weight: bold;
/* border: 1px solid violet; */

`;
const EditBtn = styled.div`
width: 15%;
display: flex;
/* border: 1px solid orange; */
justify-content: right;
`;

const ModiBtn = styled.button`
width: 20%;
height: 50%;
text-align: center;
`;

const DelBtn = styled.button`
width: 20%;
height: 50%;
`;

const BlankBox = styled.div`
width: 100%;
height: 10vw;
border: none;
`;



export default CommunityTab;