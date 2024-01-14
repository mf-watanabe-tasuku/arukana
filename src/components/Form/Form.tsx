import { styled } from 'styled-components';
import { useForm } from '../../context/FormContext';
import { useLoading } from '../../context/LoadingContext';
import FormAddress from './FormAddress';
import FormRecommend from './FormRecommend';
import FormKeyword from './FormKeyword';
import FormRadius from './FormRadius';
import FormSubmit from './FormSubmit';
import ErrorMessage from '../ErrorMessage';
import Loading from '../Loading';

const StyledSearchForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const StyledSearchStepItem = styled.div`
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 5px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 424px) {
    padding: 20px 15px 15px;
  }
`;

const StyledSearchStepNum = styled.span`
  color: #999999;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
`;

const StyledSearchStepTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 1.2;

  @media (max-width: 424px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`

const StyledSearchStepSubTitle = styled.p`
  color: #666;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`;

const StyledTextCenter = styled.div`
  text-align: center;
`;

const Form: React.FC = () => {
  const { loading } = useLoading();
  const { errorMessages } = useForm();

  return (
    loading ? <Loading /> : (
      <StyledSearchForm>
        <StyledSearchStepItem>
          <StyledSearchStepNum>STEP1</StyledSearchStepNum>
          <StyledSearchStepTitle>調べたい住所を入力</StyledSearchStepTitle>
          <FormAddress />
          <ErrorMessage message={errorMessages.originAddress} />
        </StyledSearchStepItem>
        <StyledSearchStepItem>
          <StyledSearchStepNum>STEP2</StyledSearchStepNum>
          <StyledSearchStepTitle>検索したい施設を選ぶ</StyledSearchStepTitle>
          <StyledSearchStepSubTitle>選択肢から選ぶ</StyledSearchStepSubTitle>
          <FormRecommend />
          <FormKeyword />
          <ErrorMessage message={errorMessages.keyword} />
        </StyledSearchStepItem>
        <StyledSearchStepItem>
          <StyledSearchStepNum>STEP3</StyledSearchStepNum>
          <StyledSearchStepTitle>検索する半径距離</StyledSearchStepTitle>
          <FormRadius />
          <ErrorMessage message={errorMessages.radius} />
        </StyledSearchStepItem>
        <FormSubmit />
        <StyledTextCenter>
          <ErrorMessage message={errorMessages.notice} />
        </StyledTextCenter>
      </StyledSearchForm>
    )
  );
}

export default Form;
