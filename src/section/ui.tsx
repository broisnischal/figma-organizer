import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback } from 'preact/hooks'

import { CloseHandler, CreateSectionHandler, } from '../types'


function Plugin() {
  // const [formData, setFormData] = useState<PluginFormData>({
  //   title: '',
  //   description: '',
  //   headerBackground: '#333333',
  //   isVerified: false,
  //   status: 'idea',
  //   link: ''
  // });

  // const options: Array<RadioButtonsOption> = [
  //   {
  //     children: <Text>Idea</Text>,
  //     value: 'idea'
  //   }, {
  //     children: <Text>InProgress</Text>,
  //     value: 'inprogess'
  //   }, {
  //     children: <Text>Shipped</Text>,
  //     value: 'shipped'
  //   }, {
  //     children: <Text>Disclosed</Text>,
  //     value: 'disclosed'
  //   }];

  // const handleInputChange = useCallback((field: keyof PluginFormData, value: string | boolean) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // }, []);

  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      emit<CreateSectionHandler>('CREATE_SECTION', {
        title: "testing"
      })
    },
    [] // formData
  )
  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>('CLOSE')
  }, [])

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Text>
        <Muted>Title</Muted>
      </Text>
      <VerticalSpace space="small" />
      {/* <Textbox
        value={formData.title}
        onChange={e => handleInputChange('title', e.currentTarget.value)}
        style={{
          border: '1px solid #333'
        }}
      /> */}
      {/* <TextboxNumeric
        onNumericValueInput={setCount}
        onValueInput={setCountString}
        value={countString}
        variant="border"
      /> */}
      <VerticalSpace space="extraLarge" />
      <Text>
        <Muted>Description</Muted>
      </Text>

      <VerticalSpace space="small" />

      {/* <TextboxMultiline
        style={{
          border: '1px solid #333'
        }}
        value={formData.description}
        onChange={e => handleInputChange('description', e.currentTarget.value)}
      /> */}

      <VerticalSpace space="extraLarge" />

      <Text>
        <Muted>Header Background</Muted>
      </Text>

      <VerticalSpace space="small" />


      {/* {formData.headerBackground && <TextboxColor
        variant='border'
        hexColor={formData.headerBackground}
        opacity='1'

        onChange={e => {
          console.log(e)

          // handleInputChange('headerBackground', e as any as string)
        }}
      />} */}

      {/* <ColorBox
        hexColor={formData.headerBackground!}
        onHexColorInput={e => handleInputChange('headerBackground', e.currentTarget.value)}
        onOpacityInput={e => handleInputChange('headerBackground', e.currentTarget.value)}
        opacity='1'
        variant='border'
      /> */}

      <VerticalSpace space="extraLarge" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* <Toggle
          value={formData.isVerified}
          onValueChange={value => handleInputChange('isVerified', value)}
          children={
            <Text>
              <Muted>is verified</Muted>
            </Text>
          }
        /> */}

        {/* <Dropdown
          options={options}
          style={{ width: '60%' }}
          value={formData.status}
          onChange={e => handleInputChange('status', e.currentTarget.value)}
        /> */}
      </div>

      {/* <RadioButtons about={'Test'} onChange={handleChange} options={options} value={value} /> */}

      <VerticalSpace space="extraLarge" />


      <Text>
        <Muted>Link</Muted>
      </Text>

      <VerticalSpace space="small" />

      {/* <Textbox
        style={{
          border: '1px solid #333' 
        }}
        value={formData.link}
        onChange={e => handleInputChange('link', e.currentTarget.value)}
      /> */}

      <VerticalSpace space="extraLarge" />

      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCreateRectanglesButtonClick}>
          Create
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
