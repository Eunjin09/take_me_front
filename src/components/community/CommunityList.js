import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Modal from "../public/BasicModalForm";
import PostModal from "./PostModal";

import Like from "./Like";
import ListModal from "./ListModal";
import GoalChart from "../public/Goal";

import { useNavigate } from "react-router-dom";
import { getUserInfoDB } from "../../store/modules/user";
import { loadMoreContentDB, loadpostsAc, deletePostAc } from "../../store/modules/community";

import {  Comment, Binheart,  SaveList } from "../../assets/icons";


const CommunityList = () => {

  useEffect(() => {
    dispatch(loadpostsAc())
    dispatch(getUserInfoDB())
  }, [])

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [savedListIndex, setSavedListIndex] = useState();
  const [target, setTarget] = useState(null);
  const [iLike, setILike] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState();
  const [modalName, setModalName] = useState("");
  const openModal = () => { setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); };


  
  const userinfo = useSelector((state) => state.user.infoList)
  const Postdata = useSelector((state) => state.community.postList.data);
  const Savedata = useSelector((state) => state.saved.savedItem);


  return (
    <>
      <Wrap>
        {Postdata.map((postList, index) => {
          return (
            <ul key={index}>       

              <li>
                <ImageBox>

                  <div className="goalDiv">
                    <GoalChart color="#26DFA6" percent={postList.goalPercent} size="150"/>
                  </div>

                  <div className="imgDiv">
                    <img 
                      src={postList.image}
                      style={{width:"140px", height:"140px"}}/>
                  </div>

                </ImageBox>

                
                <div className="contentForm">
                  <div onClick={() => {
                      Navigate
                        (`/detail/${postList.boardId}`,
                          { state: { name: postList } }
                        )
                    }}>
                    <p style={{fontSize:"1.5rem"}}>{postList.goalItemName}</p>
                    <div className="textArea">
                      <p style={{fontSize:"1.2rem"}}>{postList.nickname}</p>
                      {postList.contents}
                  </div>
                  </div>
                  <div className="boardInfo">
                  <div>
                  <Binheart/> {postList.likeCount}
                  <Comment/> {postList.commentCount}
                  </div>

                  <SaveList onClick={() => {
                            openModal();
                            setModalName(<SaveList/>);
                            setModalState(<ListModal
                              boardId={postList.boardId}
                              goalItemName={postList.goalItemName}
                              />)}}/>
                  </div>
                </div>
                </li>

              </ul>

          );

        })}

        <div className="buttonBox">
          <button onClick={() => {
            openModal();
            setModalName("내 태산 % 공유");
            setModalState(<PostModal close={closeModal} />)
          }}><p>내 태산 %  공유</p></button>
        </div>
      </Wrap>

      <Modal
        open={modalOpen}
        close={closeModal}
        header={modalName}>
        {modalState}
      </Modal>
    </>
  )
}

const Wrap = styled.div`
width: 100%;
height: 100%;
background: #EDEDED;
display: flex;
align-items: center;
flex-direction: column;

.buttonBox{
  display: flex;
  width: 80%;
  border-radius: 30px;
  padding: 1rem;
  position: fixed;
  bottom: 10%;
  background: #26DFA6;
  justify-content: center;
  z-index: 1;

  button{
    color: white;
    font-weight: 500;

  }
  p{
    font-size: 1.5rem;
  }
}

ul{
  width: 100%;
  height: 25vh;
}


li{
  background: white;
  height: 85%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 15px;
}

.contentForm{
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  padding: 1rem;
  .boardInfo{
    display: flex;
    align-items: center;
    justify-content: space-between;
    div{
      display: flex;
      gap: 10px;
    }
  }

}
.textArea{
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10%;
}

`;


const ImageBox = styled.div`
width: 150px;
display: flex;
justify-content: center;
align-items: center;
position: relative;
.goalDiv{
    position: absolute;
    z-index: 1;

  }
.imgDiv{
  overflow: hidden;
  border-radius:50%;
  position: relative;
}



`;

export default CommunityList;
