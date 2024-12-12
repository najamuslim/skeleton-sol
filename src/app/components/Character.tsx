import { FC } from 'react'
import BaseSkeleton from '../constants/skeletons/base'
import Clothes1 from '../constants/skeletons/clothes/Clothes1'
import Clothes2 from '../constants/skeletons/clothes/Clothes2'
import Clothes3 from '../constants/skeletons/clothes/Clothes3'
import Clothes4 from '../constants/skeletons/clothes/Clothes4'
import Clothes5 from '../constants/skeletons/clothes/Clothes5'
import Fingers1 from '../constants/skeletons/fingers/Fingers1'
import Fingers2 from '../constants/skeletons/fingers/Fingers2'
import Fingers3 from '../constants/skeletons/fingers/Fingers3'
import Fingers4 from '../constants/skeletons/fingers/Fingers4'
import Fingers5 from '../constants/skeletons/fingers/Fingers5'
import Fingers6 from '../constants/skeletons/fingers/Fingers6'
import Fingers7 from '../constants/skeletons/fingers/Fingers7'
import Hats1 from '../constants/skeletons/hats/Hats1'
import Hats2 from '../constants/skeletons/hats/Hats2'
import Hats3 from '../constants/skeletons/hats/Hats3'
import Hats4 from '../constants/skeletons/hats/Hats4'
import Hats5 from '../constants/skeletons/hats/Hats5'
import Shoes1 from '../constants/skeletons/shoes/Shoes1'
import Shoes2 from '../constants/skeletons/shoes/Shoes2'
import Shoes3 from '../constants/skeletons/shoes/Shoes3'
import Shoes4 from '../constants/skeletons/shoes/Shoes4'
import Shoes5 from '../constants/skeletons/shoes/Shoes5'
import Shorts1 from '../constants/skeletons/shorts/Shorts1'
import Shorts2 from '../constants/skeletons/shorts/Shorts2'
import Shorts3 from '../constants/skeletons/shorts/Shorts3'
import Shorts4 from '../constants/skeletons/shorts/Shorts4'
import Shorts5 from '../constants/skeletons/shorts/Shorts5'   

const Character: FC = () => {
  return (
    <svg id="character" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
      {/* Base/Skeleton */}
      <BaseSkeleton />

      {/* Clothes */}
      <Clothes5 color='#6461F6'/>

      {/* Fingers */}
      <Fingers7/>

      {/* Hats */}
      <Hats5 color='#6461F6'/>

      {/* Shoes */}
      <Shoes5 color='#6461F6'/>

      {/* Shorts */}
      <Shorts5 color='#6461F6'/>
    </svg>
  )
}

export default Character 